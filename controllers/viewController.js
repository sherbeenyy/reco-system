const fs = require('fs');
const path = require('path');
const excel = require('excel4node');

// Path to the database file
const dataFilePath = path.join(__dirname, '../data/database.json');

const viewData = (req, res) => {
    let data = [];

    if (fs.existsSync(dataFilePath)) {
        data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    }

    res.render('viewData', { data });
};

const downloadExcel = (req, res) => {
    let data = [];

    if (fs.existsSync(dataFilePath)) {
        data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    }

    const wb = new excel.Workbook();
    const ws = wb.addWorksheet('Sheet 1');

    // Define styles
    const style = wb.createStyle({
        font: {
            color: '#000000',
            size: 12,
        },
        border: {
            left: { style: 'thin' },
            right: { style: 'thin' },
            top: { style: 'thin' },
            bottom: { style: 'thin' },
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center',
        },
    });

    // Add column headers
    ws.cell(1, 1).string('Machine Name').style(style);
    ws.cell(1, 2).string('Type of Error').style(style);
    ws.cell(1, 3).string('Start Date').style(style);
    ws.cell(1, 4).string('Start Time').style(style);
    ws.cell(1, 5).string('End Date').style(style);
    ws.cell(1, 6).string('End Time').style(style);
    ws.cell(1, 7).string('What Error').style(style);

    // Add data rows
    data.forEach((item, index) => {
        ws.cell(index + 2, 1).string(item.machineName || '').style(style);
        ws.cell(index + 2, 2).string(item.typeOfError || '').style(style);
        ws.cell(index + 2, 3).string(item.startDate || '').style(style);
        ws.cell(index + 2, 4).string(item.startTime || '').style(style);
        ws.cell(index + 2, 5).string(item.endDate || '').style(style);
        ws.cell(index + 2, 6).string(item.endTime || '').style(style);
        ws.cell(index + 2, 7).string(item.whatError || '').style(style);
    });

    // Create a buffer and send it as a file
    wb.writeToBuffer().then(buffer => {
        res.setHeader('Content-Disposition', 'attachment; filename="data.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    });
};

module.exports = {
    viewData,
    downloadExcel
};
