const express = require('express');
const { createOtdrAct, getOtdrAct, getAllOtdrActs, deleteOtdrAct } = require('../controllers/otdrActController')
const router = express.Router();

router.post('/create', createOtdrAct); //running
router.get('/getAct/:id', getOtdrAct); //running
router.get('/', getAllOtdrActs);  //running
router.delete('/delete/:id', deleteOtdrAct); // running

module.exports = router;