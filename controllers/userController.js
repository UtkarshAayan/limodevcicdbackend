const User = require('../models/userModel');
const Role = require('../models/roleModel');
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success')


//to Create user 
const register = async (req, res, next) => {
    try {
        const role = await Role.find({ role: 'User' });
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            mobileNumber: req.body.mobileNumber,
            email: req.body.email,
            password: req.body.password,
            address: req.body.address,
            state: req.body.state,            
            city: req.body.city,
            zipcode: req.body.zipcode,
            profileImage: req.body.profileImage,
            jobTitle: req.body.jobTitle,
            roles: role
        })
        await newUser.save();
        // return res.status(200).json("User Registered Successfully")
        return next(createSuccess(200, "User Registered Successfully"))
    }
    catch (error) {
        //return res.status(500).send("Something went wrong")
        return next(createError(500, "Something went wrong"))
    }
}

//get users
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        return next(createSuccess(200, "All Users", users));

    } catch (error) {
        return next(createError(500, "Internal Server Error!"))
    }
}

//get user
const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(createError(404, "User Not Found"));
        }
        return next(createSuccess(200, "Single User", user));
    } catch (error) {
        return next(createError(500, "Internal Server Error1"))
    }
}

//update user
const updateUser = async (req, res, next) => {
    try {
         const {id} = req.params;
         const users = await User.findByIdAndUpdate(id, req.body);
         if (!users) {
             return next(createError(404, "User Not Found"));
         }
         return next(createSuccess(200, "User Details Updated", users));
     } catch (error) {
         return next(createError(500, "Internal Server Error!"));
     }
 };

//delete user
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return next(createError(404, "User Not Found"));
        }
        return next(createSuccess(200, "User Deleted", user));
    } catch (error) {
        return next(createError(500, "Internal Server Error"))
    }
}


module.exports = { register, getUser, getAllUsers, updateUser, deleteUser }