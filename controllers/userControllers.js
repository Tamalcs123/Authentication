const User = require("../model/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const { use } = require("../routes/userRoutes");

dotenv.config();

//register
const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.json({ message: "User already exists.." });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: username,
      email: email,
      password: hashPassword,
    });

    const token = await jwt.sign(
      {
        email: newUser.email,
        id: newUser._id,
      },
      process.env.SECRET_KEY
    );

    return res.json({ user: newUser, token: token });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

//login
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      return res.json({ message: "User is not found" });
    }

    const credentials = await bcrypt.compare(password, existingUser.password);
    if (!credentials) {
      return res.json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      {
        username: existingUser,
        id: existingUser._id,
      },
      process.env.SECRET_KEY
    );

    return res.json({ user: existingUser, token: token });
  } catch (error) {
    return res.json(error);
  }
};

//forget-password

const sendResetPasswordMail = async (username, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 587,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "For forget password",
      html:
        "Hii " +
        username +
        ' please copy the link and <a href="http://localhost:5000/api/auth/reset_password?token=' +
        token +
        '">reset your password </a>',
    };

    transporter.sendMail(mailOptions,(error,info)=>{
      if(error){
        console.log(error);
      }else{
        console.log('Mail has been send..',info.response);
      }

    })
  } catch (error) {
    res.send(error);
  }
};

const forget_password = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await User.findOne({ email: email });

    if (userData) {
      const randomString = await randomstring.generate();
      const data = await User.updateOne(
        { email: email },
        { $set: { token: randomString } }
      );
      sendResetPasswordMail(userData.username,userData.email,randomString)
      res.send({ message: "Please check your inbox..." });
    } else {
      res.send({ message: "Email is not found.." });
    }
  } catch (error) {
    res.send(error);
  }
};

module.exports = { register, login, forget_password };
