const drivers = require('../models/driversModel');
const Role = require('../models/roleModel');
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');
const path = require('path');
const fs = require('fs');

const defaultImage = {
    filename: 'default-image.jpg',
    contentType: 'image/png',
    url: 'https://limoimage.s3.amazonaws.com/default-image.jpg' 
};

const createDriver = async (req, res, next) => {
    try {
        const role = await Role.findOne({ role: 'Driver' });
        const {
            name,
            username,
            mobileNumber,
            email,
            password,
            address,
            state,
            city,
            zipcode,
            licenseType,
            driverLicense,
            passport,
            workRights,
            drivingHistory,
            driverPolicyNumber,
        } = req.body;

        let images = [];

        if (!req.files || req.files.length === 0) {
            // Use the default image if no files are uploaded
            images = [defaultImage];
        } else {
            // Map the uploaded files from S3 to include filenames, content types, and URLs
            images = req.files.map(file => ({
                filename: file.key,      // S3 stores the file under 'key'
                contentType: file.mimetype,
                url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.key}` // Construct the URL using the bucket name and region
            }));
        }

        const newDriver = new drivers({
            name,
            username,
            mobileNumber,
            email,
            password,
            address,
            state,
            city,
            zipcode,
            licenseType,
            driverLicense,
            passport,
            workRights,
            drivingHistory,
            images,  // Save the images array which now includes URLs
            driverPolicyNumber,
            roles: role,
        });

        await newDriver.save();
        return res.status(200).json({ success: true, message: "Driver Registered Successfully" });
    } catch (error) {
        return next(createError(500, "Something went wrong"));
    }
};



// get driver by ID
const getDriver = async (req, res, next) => {
    try {
        const driver = await drivers.findById(req.params.id);
        if (!driver) {
            return next(createError(404, "Driver Not Found"));
        }
        return next(createSuccess(200, "Single Driver", driver));
    } catch (error) {
        return next(createError(500, "Internal Server Error"))
    }
};

// get All Driver
const getAllDrivers = async (req, res, next) => {
    try {
        const newDriver = await drivers.find();
        return next(createSuccess(200, "All Drivers", newDriver));
    } catch (error) {
        return next(createError(500, "Internal Server Error!"));
    }
};

//update driver by ID
const updateDriver = async (req, res, next) => {
    try {
        const { id } = req.params;
        const newDriver = await drivers.findByIdAndUpdate(id, req.body);
        if (!newDriver) {
            return next(createError(404, "Driver Not Found"));
        }
        return next(createSuccess(200, "Driver Details Updated", newDriver));
    } catch (error) {
        return next(createError(500, "Internal Server Error!"));
    }
};

// delete Driver by ID
const deleteDriver = async (req, res, next) => {
    try {
        const newDriver = await drivers.findByIdAndDelete(req.params.id);
        if (newDriver) {
            return next(createSuccess(200, "Driver Deleted!"));
        } else {
            return next(createError(404, "Driver Not Found."));
        }
    } catch (error) {
        return next(createError(500, "Internal Server Error: Something went wrong."));
    }
};

module.exports = { createDriver, getDriver, getAllDrivers, updateDriver, deleteDriver };