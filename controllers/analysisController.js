const fs = require('fs');
const path = require('path');

// Path to the database file
const dataFilePath = path.join(__dirname, '../data/database.json');

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

const renderDetailedAnalysisPage = (req, res) => {
    const analysisData = calculateDetailedAnalysis();
    const machineErrors = getMachineErrors();
    res.render('detailedAnalysis', { analysisData, machineErrors });
};

const getMachineErrors = () => {
    return {
        "Machine A": {
            "mechanical": ["Belt Misalignment", "Bearing Failure", "Vibration"],
            "electrical": ["Short Circuit", "Overvoltage"]
        },
        "Machine B": {
            "mechanical": ["Belt Misalignment", "Bearing Failure", "Vibration"],
            "electrical": ["Short Circuit", "Overvoltage"]
        },
        "Machine C": {
            "mechanical": ["Belt Misalignment", "Bearing Failure", "Vibration"],
            "electrical": ["Short Circuit", "Overvoltage"]
        },
        "Machine D": {
            "mechanical": ["Belt Misalignment", "Bearing Failure", "Vibration"],
            "electrical": ["Short Circuit", "Overvoltage"]
        },
        "Machine F": {
            "mechanical": ["Belt Misalignment", "Bearing Failure", "Vibration"],
            "electrical": ["Short Circuit", "Overvoltage"]
        },
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

    res.render('compare', { machine1, machine2, comparisons });
};

module.exports = {
    renderDetailedAnalysisPage,
    compareMachines,
    getMachineErrors
};
