import { User } from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const saltRounds = 10;
import nodemailer from "nodemailer";

import dotenv from "dotenv";
dotenv.config();
const verifyEmail = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    const data = jwt.verify(token, "shhhhh");
    const user = await User.findOne({ email: data.email });
    if (!user)
      return res.status(400).json({ error: "Invalid or expired token" });
    user.isVerified = true;

    await user.save();

    //  res.redirect(`http://localhost:5173/email-verified`);
    res.status(200).json({ message: "Done" });
  }
};
const LoginUser = async (req, res) => {
  const data = req.body;
  const user = await User.findOne({ email: data.email });
  try {
    if (user.isVerified == "true") {
      bcrypt.compare(data.password, user.password, function (err, result) {
        if (result) {
          const token = jwt.sign({ email: user.email }, "shhhhh");
          res.cookie("token", token, {
            httpOnly: true,
            secure: true, // set to true if using HTTPS
            sameSite: 'none', // or "Strict"
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });
          res.status(201).json(token);
        } else {
          res.status(404).json({ message: "This combination is wrong" });
        }
      });
    } else {
      res.status(404).json({ message: "This combination is wrong" });
    }
  } catch (err) {
    res.status(404).json({ message: "This combination is wrong" });
  }
};
const verifyUser = async (req, res) => {

  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    const data = jwt.verify(token, "shhhhh");

    const resp = await User.findOne({ email: data.email });

    if (resp?.isVerified == "true") {
      res.status(202).json({
        email: resp.email,
        id: resp._id,
        name: resp.name,
        isVerified:resp.isVerified
      });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  }
};
const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout Successfully !" });
};
const sendVerificationEmail = async (req, res) => {
  try {
    const token = req.cookies?.token;
    const email = req.body.email;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_ACOUNT_USER,
        pass: process.env.GOOGLE_ACOUNT_PASS,
      },
    });

    const url = `${process.env.VITE_BACKEND_URL}verify-email?token=${token}`;

    const mailOptions = {
      from: `"Verify Your Email" <${process.env.GOOGLE_ACOUNT_USER}>`,
      to: email,
      subject: "Email Verification",
      html: `
      <h2>Verify your email</h2>
      <p>Click the link below to verify:</p>
      <a href="${url}">${url}</a>
      <p>This link expires in 1 hour.</p>
    `,
    };

    const resp = await transporter.sendMail(mailOptions);
   
    res.status(200).json({ message: "Done" });
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    res.status(500).json({ message: "Failed to send verification email" });
  }
};
const createUser = async (req, res) => {
  const existuser = await User.findOne({ email: req.body.email });


  if (!existuser) {
    bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
      const user = new User({
        email: req.body.email,
        password: hash,
        name: req.body.name,
        isVerified: false,
      });

      try {
        const docs = await user.save();
        const token = jwt.sign({ email: docs.email }, "shhhhh");
        res.cookie("token", token, {
          httpOnly: true,
          secure: true, // set to true if using HTTPS
          sameSite:  'none', // or "Strict"
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(201).json({ token });
      } catch (error) {
        res.status(400).json(error);
      }
    });
  } else {
    res.status(400).json({ message: "User is already exist" });
  }
};
const deleteAccount = async (req, res) => {
  const token = req.cookies?.token;
  try {
    
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      const data = jwt.verify(token, "shhhhh");
  
      
      const resp = await User.findOne({ email: data.email });

      if (resp?.isVerified == "true") {


      const r=  await User.findOneAndDelete({email:resp?.email});
          res.clearCookie("token");
        res.status(200).json({ message: "Account deleted successfully." });
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Server error. Could not delete account." });
  }
};

export {
  createUser,
  verifyEmail,
  sendVerificationEmail,
  verifyUser,
  LoginUser,
  logout,
  deleteAccount,
};
