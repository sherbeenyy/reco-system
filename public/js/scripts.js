document.addEventListener('DOMContentLoaded', () => {
    // Safely output the machineErrors object as JSON
    const machineErrors = JSON.parse(document.getElementById('machineErrors').textContent);
    console.log("Script is running");
    console.log("machineErrors:", machineErrors);

    const machineSelect = document.getElementById('machineName');
    const errorTypeSelect = document.getElementById('typeOfError');
    const whatErrorSelect = document.getElementById('whatError');
    const startDateInput = document.getElementById('startDate');
    const startTimeInput = document.getElementById('startTime');
    const endDateInput = document.getElementById('endDate');
    const endTimeInput = document.getElementById('endTime');

    function updateErrors() {
        const machine = machineSelect.value;
        const errorType = errorTypeSelect.value;

        // Clear existing options
        while (whatErrorSelect.options.length) {
            whatErrorSelect.remove(0);
        }

        if (machine && errorType) {
            const errors = (machineErrors[machine] && machineErrors[machine][errorType]) || [];
            errors.forEach(error => {
                const option = document.createElement('option');
                option.value = error;
                option.text = error;
                whatErrorSelect.add(option);
            });
        } else {
            const option = document.createElement('option');
            option.value = '';
            option.text = 'Select an error';
            option.disabled = true;
            option.selected = true;
            whatErrorSelect.add(option);
        }
    }

    function validateDates() {
        const startDate = new Date(startDateInput.value);
        const startTime = startTimeInput.value ? new Date(`1970-01-01T${startTimeInput.value}`) : null;
        const endDate = new Date(endDateInput.value);
        const endTime = endTimeInput.value ? new Date(`1970-01-01T${endTimeInput.value}`) : null;

        if (startDate > endDate || (startDate.getTime() === endDate.getTime() && startTime && endTime && startTime > endTime)) {
            alert('End date/time cannot be before start date/time.');
            endDateInput.value = '';
            endTimeInput.value = '';
            return false;
        }
        return true;
    }

    // Attach event listeners
    machineSelect.addEventListener('change', updateErrors);
    errorTypeSelect.addEventListener('change', updateErrors);
    startDateInput.addEventListener('change', validateDates);
    startTimeInput.addEventListener('change', validateDates);
    endDateInput.addEventListener('change', validateDates);
    endTimeInput.addEventListener('change', validateDates);
});
