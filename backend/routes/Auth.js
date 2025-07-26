import express from 'express'
import { createUser, deleteAccount, LoginUser, logout, sendVerificationEmail, verifyEmail, verifyUser } from '../controller/Auth.js';
const authRouter=express.Router();

authRouter.post('/signup',createUser)
.get('/verify-email',verifyEmail)
.get('/checkUser',verifyUser)
.post('/send-email',sendVerificationEmail)
.post('/login',LoginUser)
.get('/logout',logout)
.get('/delete',deleteAccount)


export {authRouter};