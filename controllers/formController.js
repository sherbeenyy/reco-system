// controllers/formController.js

const fs = require('fs');
const path = require('path');

const machineErrors = {
    "Machine A": {
        "mechanical": ["Belt Misalignment", "Bearing Failure", "Vibration"],
        "electrical": ["Short Circuit", "Overvoltage"]
    },
    "Machine B": {
        "mechanical": ["Gear Wear", "Overheating"],
        "electrical": ["Power Failure", "Insulation Failure"]
    },
    "Machine C": {
        "mechanical": ["Shaft Misalignment", "Vibration"],
        "electrical": ["Overvoltage", "Fuse Blown"]
    },
    // Add more machines as needed
};

const renderForm = (req, res) => {
    const selectedMachine = req.query.machineName || '';
    const selectedErrorType = req.query.typeOfError || '';
    const errors = selectedMachine && selectedErrorType 
        ? machineErrors[selectedMachine][selectedErrorType] || [] 
        : [];

    res.render('form', {
        machineErrors,
        selectedMachine,
        selectedErrorType,
        errors
    });
};

// Path to the database file
const dataFilePath = path.join(__dirname, '../data/database.json');

// Function to save form data to the JSON file
const saveFormData = (data) => {
    let existingData = [];

    if (fs.existsSync(dataFilePath)) {
        existingData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    }

    existingData.push(data);
    fs.writeFileSync(dataFilePath, JSON.stringify(existingData, null, 2), 'utf-8');
};

// Controller function to handle form submission
const handleFormSubmit = (req, res) => {
    console.log('Request body:', req.body); // Debugging line

    const formData = {
        machineName: req.body.machineName || '',
        typeOfError: req.body.typeOfError || '',
        startDate: req.body.startDate || '',
        startTime: req.body.startTime || '',
        endDate: req.body.endDate || '',
        endTime: req.body.endTime || '',
        whatError: req.body.whatError || ''
    };

    saveFormData(formData);
    res.redirect('/'); // Redirect after saving
};
// Controller function to handle viewing data
const viewData = (req, res) => {
    let data = [];

    if (fs.existsSync(dataFilePath)) {
        data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    }

    res.render('viewData', { data });
};

const excel = require('excel4node');

// Controller function to handle Excel download
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

//ANALYSIS 
// Function to read form data from the JSON file
const getFormData = () => {
    if (fs.existsSync(dataFilePath)) {
        return JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    }
    return [];
};
const calculateDetailedAnalysis = () => {
    const data = getFormData();
    const analysisData = {};

    data.forEach(entry => {
        const machine = entry.machineName;
        const errorType = entry.typeOfError;
        const whatError = entry.whatError;
        const startDateTime = new Date(`${entry.startDate}T${entry.startTime}`);
        const endDateTime = new Date(`${entry.endDate}T${entry.endTime}`);
        const duration = (endDateTime - startDateTime) / (1000 * 60 * 60); // duration in hours

        if (!analysisData[machine]) {
            analysisData[machine] = {};
        }
        if (!analysisData[machine][errorType]) {
            analysisData[machine][errorType] = {};
        }
        if (!analysisData[machine][errorType][whatError]) {
            analysisData[machine][errorType][whatError] = 0;
        }

        analysisData[machine][errorType][whatError] += duration;
    });

    return analysisData;
};

// Controller function to render the detailed analysis page
const renderDetailedAnalysisPage = (req, res) => {
    const analysisData = calculateDetailedAnalysis();
    const machineErrors = getMachineErrors(); // Assuming a function to get machine errors
    res.render('detailedAnalysis', { analysisData, machineErrors });
};

// Function to get machine errors (similar to existing function)
const getMachineErrors = () => {
    return {
        "Machine A": {
            "mechanical": ["Belt Misalignment", "Bearing Failure", "Vibration"],
            "electrical": ["Short Circuit", "Overvoltage"]
        },
        "Machine B": {
            "mechanical": ["Gear Wear", "Overheating"],
            "electrical": ["Power Failure", "Insulation Failure"]
        },
        "Machine C": {
            "mechanical": ["Shaft Misalignment", "Vibration"],
            "electrical": ["Overvoltage", "Fuse Blown"]
        },
        // Add more machines as needed
    };
};

const compareMachines = (req, res) => {
    const { machine1, machine2 } = req.query;
    let comparisons = [];

    if (machine1 && machine2) {
        const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

        const getMachineData = (machine) => {
            return data.filter(entry => entry.machineName === machine);
        };

        const calculateTotalTime = (entries) => {
            return entries.reduce((total, entry) => {
                const start = new Date(`${entry.startDate}T${entry.startTime}`);
                const end = new Date(`${entry.endDate}T${entry.endTime}`);
                const timeDiff = end - start; // Difference in milliseconds
                return total + (timeDiff / (1000 * 60 * 60)); // Convert to hours
            }, 0);
        };

        const getMostOccurredError = (entries) => {
            const errorCount = {};
            entries.forEach(entry => {
                const error = entry.whatError;
                errorCount[error] = (errorCount[error] || 0) + 1;
            });
            const mostOccurredError = Object.keys(errorCount).reduce((a, b) => errorCount[a] > errorCount[b] ? a : b, '');
            return { error: mostOccurredError, count: errorCount[mostOccurredError] || 0 };
        };

        const machine1Data = getMachineData(machine1);
        const machine2Data = getMachineData(machine2);

        comparisons = [
            {
                machine: machine1,
                totalTime: calculateTotalTime(machine1Data).toFixed(2), // Limit to 2 decimal places
                count: machine1Data.length,
                mostOccurredError: getMostOccurredError(machine1Data)
            },
            {
                machine: machine2,
                totalTime: calculateTotalTime(machine2Data).toFixed(2), // Limit to 2 decimal places
                count: machine2Data.length,
                mostOccurredError: getMostOccurredError(machine2Data)
            }
        ];
    }

    res.render('compare', { comparisons, machineErrors });
};
module.exports = {
    handleFormSubmit,
    renderForm,
    viewData,
    downloadExcel,
    renderDetailedAnalysisPage,
    compareMachines

};
