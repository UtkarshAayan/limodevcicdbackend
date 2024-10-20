const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const defaultImage = {
    filename: 'default-image.jpg',
    contentType: 'image/png',
    url: 'https://limoimage.s3.amazonaws.com/default-image.jpg' 
  };
const imageSchema1 = new mongoose.Schema({
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    url: { type: String, required: true }
  });

const driver = new Schema(
    {
        name: {
            type: String,
            required: false
        },
        username: {
            type: String,
            required: false
        },
        mobileNumber: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false
        },
        password: {
            type: String,
            required: false
        },
        images: {
            type: [imageSchema1],
            default: [defaultImage]
          },
        address: {
            type: String,
            required: false
        },
        state: {
            type: String,
            required: false
        },       
        city: {
            type: String,
            required: false
        },       
        zipcode: {
            type: String,
            required: false
        },
        licenseType: {
            type: String,
            required: false
        },
        driverLicense: {
            type: String,
            required: false
        },
        passport: {
            type: String,
            required: false
        },
        workRights: {
            type: String,
            required: false
        },
        drivingHistory:  {
            type: String,
            required: false
        },
        driverPolicyNumber: {
            type: String,
            required: false
        },
        roles: {
            type: [Schema.Types.ObjectId],
            required: true,
            ref: "Role"
        },
        otp: { type: String },
        otpExpiration: { type: Date }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('drivers', driver);