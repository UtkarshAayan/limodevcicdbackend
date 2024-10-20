const User = require('../models/userModel');
const Role = require('../models/roleModel');
const Driver=require('../models/driversModel')
const UserToken = require('../models/userTokenModel')
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt');


//signup
const userSignup = async (req, res, next) => {
  try {
    const role = await Role.find({ role: 'User' });
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,      
      email: req.body.email,
      password :hashedPassword,
      roles: role
    })
    await newUser.save();
    return res.status(200).json("User Signup/Registered Successfully")
  }
  catch (error) {
    return next(createError(500, "Something went wrong"))
  }
}

// Drive Signup
const driveSignup = async (req, res, next) => {
  try {
    const role = await Role.find({ role: 'Driver' });
    const newDriver = new Driver({
      name: req.body.name,
      username: req.body.username,
      mobileNumber: req.body.mobileNumber,
      email: req.body.email,
      password: req.body.password,
      profileImage: req.body.profileImage,
      address: req.body.address,
      state: req.body.state,
      city: req.body.city,
      zipcode: req.body.zipcode,
      licenseType: req.body.licenseType,
      driverLicense: req.body.driverLicense,
      passport: req.body.passport,
      workRights: req.body.workRights,
      drivingHistory: req.body.drivingHistory,
      roles:role
    });

    await newDriver.save();
    return res.status(200).json("Driver Signup/Registered Successfully");
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

//to login
const login = async (req, res, next) => {
  try {
    let driver=[];
    let isPassword=[]
    let user = await User.findOne({ email: req.body.email }).populate("roles", "role");
    let userType = "user";

    if (!user) {
      driver = await Driver.findOne({ email: req.body.email }).populate("roles", "role");
      userType = "driver";
    }

    if (!user && !driver) {
      return next(createError(404, "User or Driver Not Found"));
    }

    if(userType=="user"){
      isPassword = await bcrypt.compare(req.body.password, user.password);
      if (!isPassword) {
        return next(createError(404, "Password is Incorrect"));
      }
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin, roles: user.roles, userType },
        process.env.JWT_SECRET
      );
  
      res.cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json({
          token,
          status: 200,
          message: "Login Success",
          data: user
        });

    }else{
     isPassword = await bcrypt.compare(req.body.password, driver.password);
      if (!isPassword) {
        return next(createError(404, "Password is Incorrect"));
      }
      const token = jwt.sign(
        { id: driver._id, isAdmin: driver.isAdmin, roles: driver.roles, userType },
        process.env.JWT_SECRET
      );

      res.cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json({
          token,
          status: 200,
          message: "Login Success",
          data: driver
        });
      }
  }
  catch (error) {
    // return res.status(500).send("Something went wrong")
    return next(createError(500, "Something went wrong"))
  }
};

//Register Admin
const registerAdmin = async (req, res, next) => {
  try {
    const role = await Role.find({});
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      mobileNumber: req.body.mobileNumber,
      email: req.body.email,
      password: req.body.password,
      isAdmin: true,
      roles: role
    })
    await newUser.save();
    //return res.status(200).send("User Registered Successfully")
    return next(createSuccess(200, "Admin Registered Successfully"))
  }
  catch (error) {
    //return res.status(500).send("Something went wrong")
    return next(createError(500, "Something went wrong"))
  }
}

//sendresetmail
const sendEmail = async (req, res) => {
  const email = req.body.email;
  try {
    let driver=[];
    let user = await User.findOne({ email });
    let userType = "user";
    if (!user) {
      driver = await Driver.findOne({ email });
      userType = "driver";
    }

    if (!user && !driver) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    if(userType=="user"){
    user.otp = otp;
    user.otpExpiration = Date.now() + 15 * 60 * 1000;
    await user.save();
    }else{
    driver.otp = otp;
    driver.otpExpiration = Date.now() + 15 * 60 * 1000;
    await driver.save();
    }

    const ResetPasswordLink = `http://localhost:3000/reset-password?token=${otp}`;
    
    const mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailDetails = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p><p>This OTP is valid for 15 minutes.</p>
      <p><a href="${ResetPasswordLink}" style="padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a></p>`
    };

    // await mailTransporter.sendMail(mailDetails);
    mailTransporter.sendMail(mailDetails);
    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyOTP = async (req, res) => {
  const { otp } = req.body;
  try {
    let driver=[];
    let user = await User.findOne({ otp, otpExpiration: { $gt: Date.now() } });
    let userType = "user";
    if (!user) {
      driver = await Driver.findOne({ otp, otpExpiration: { $gt: Date.now() } });
      userType = "driver";
    }

    if (!user && !driver) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if(userType=="user"){
      user.otp = undefined;
      user.otpExpiration = undefined;
      await user.save();
    }else{
      driver.otp = undefined;
      driver.otpExpiration = undefined;
      await driver.save();
    }


    const token = jwt.sign({ email:user ? user.email : driver.email}, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.status(200).json({ message: "OTP verified successfully", token });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal Server Error1" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decodedToken.email;
    let driver=[];
    let user = await User.findOne({ email: userEmail });
    let userType = "user";
    if (!user) {
      driver = await Driver.findOne({ email: userEmail });
      userType = "driver";
    }

    if (!user && !driver) {
      return res.status(400).json({ message: "Invalid token" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    if(userType=="user"){
      user.password = hashedPassword;
      await user.save();
    }else{
      driver.password = hashedPassword;
      await driver.save();
    }
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { userSignup,driveSignup,login,registerAdmin, sendEmail, resetPassword, verifyOTP }