const fs = require('fs');
const path = require('path');
const {getMachineErrors} = require('./analysisController')

const machineErrors = getMachineErrors();

// Path to the database file
const dataFilePath = path.join(__dirname, '../data/database.json');

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
    res.redirect('/');
};

module.exports = {
    renderForm,
    handleFormSubmit,
    machineErrors
};
