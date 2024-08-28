// routes/formRoutes.js

const express = require('express');
const router = express.Router();
const { renderForm , handleFormSubmit, viewData, downloadExcel ,renderDetailedAnalysisPage, compareMachines } = require('../controllers/formController');

router.get('/', renderForm);
router.post('/submit', handleFormSubmit);
router.get('/view', viewData);
router.get('/analysis', renderDetailedAnalysisPage);
router.get('/download-excel', downloadExcel);
router.get('/compare', compareMachines);



module.exports = router;
