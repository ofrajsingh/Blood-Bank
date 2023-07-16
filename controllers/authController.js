const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

const registerController = async (req, res) => {
    console.log(req.body,"RAJ");
    // req.body.email= "ofrajsingh@gmail.com";
    // req.body.password= "123456";
    // req.body.role= "user";
    // req.body.name= "Raj";
    // req.body.address= "adsfdsg";
    // req.body.phone= "123456789";
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    const user = new userModel(req.body);
    await user.save();
    return res.status(201).send({
      success: true,
      message: "User registered successfully",
      user
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Register API",
      error,
    });
  }
};

module.exports = { registerController };
