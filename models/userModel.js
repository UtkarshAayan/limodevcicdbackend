const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: false
        },
        username: {
            type: String,
            required: false,
        },
        mobileNumber: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: false
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
        profileImage: {
            type: String,
            required: false
        },
        jobTitle: {
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

module.exports = mongoose.model('User', UserSchema);