const express = require('express');
const { createDriver, getDriver, getAllDrivers, updateDriver, deleteDriver } = require('../controllers/driversController');
const router = express.Router();
const upload = require('../middleware/upload');

router.post('/add', upload.array('images', 5), createDriver);   //running
router.get('/:id', getDriver);   //running
router.get('/', getAllDrivers);   //running
router.put('/:id', updateDriver);   //running
router.delete('/:id', deleteDriver);   //running

module.exports = router;