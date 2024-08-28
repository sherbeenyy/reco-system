const express = require('express');
const router = express.Router();
const { viewData, downloadExcel } = require('../controllers/viewController');

router.get('/view', viewData);
router.get('/download-excel', downloadExcel);

module.exports = router;
