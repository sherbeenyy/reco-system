const express = require('express');
const router = express.Router();
const { renderForm, handleFormSubmit } = require('../controllers/formController');
const {renderDetailedAnalysisPage , compareMachines} = require('../controllers/analysisController');
const {viewData, downloadExcel} = require('../controllers/viewController');

router.get('/', renderForm);
router.post('/submit', handleFormSubmit);
router.get('/analysis', renderDetailedAnalysisPage);
router.get('/compare', compareMachines);
router.get('/view', viewData);
router.get('/download-excel', downloadExcel);

module.exports = router;
