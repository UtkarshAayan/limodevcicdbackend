const express = require('express');
const {createInAct, getAct, getAllActs, deleteAct} = require('../controllers/inDrActController')
const router = express.Router();

router.post('/add', createInAct); //running
router.get('/getAct/:id', getAct); //running
router.get('/', getAllActs);  //running
router.delete('/delete/:id', deleteAct); // running

module.exports = router;