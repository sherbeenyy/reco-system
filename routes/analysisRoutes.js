const express = require('express');
const router = express.Router();
const { renderDetailedAnalysisPage, compareMachines } = require('../controllers/analysisController');

router.get('/analysis', renderDetailedAnalysisPage);
router.get('/compare', compareMachines);

module.exports = router;
