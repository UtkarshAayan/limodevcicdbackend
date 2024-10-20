const express = require("express");
const User = require('../models/userModel');
const { getAllUsers, getUser,deleteUser,updateUser,register } = require('../controllers/userController')
const { verifyAdmin, verifyUser } = require('../middleware/verifyToken')
// const company_route = express();
const router = express.Router();

router.post('/register', register);
router.get('/:id', verifyUser, getUser);
router.get('/', verifyAdmin, getAllUsers);
router.put('/:id', verifyAdmin, updateUser);
router.delete('/:id', verifyAdmin, deleteUser);

module.exports = router;