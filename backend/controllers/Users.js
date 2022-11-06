import Users from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

// export const getUsers = async(req, res) => {
//     try {
//         const users = await Users.findAll({
//             attributes:['id','username','email']
//         });
//         res.json(users);
//     } catch (error) {
//         console.log(error);
//     }
// }

export const Register = async(req, res) => {
    const { username, email, password, confPassword } = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EM_USER,
          pass: process.env.EM_PASS,
        },
    });
    try {
        const user = await Users.create({
            username: username,
            email: email,
            password: hashPassword
        });
        res.json({msg: "Registration Successful"});
        console.log("userid is", user.id);
        jwt.sign(
            {
              user: user,
            },
            process.env.EMAIL_SECRET,
            {
              expiresIn: '1d',
            },
            (err, emailToken) => {
              const url = `http://localhost:3001/confirmation/${emailToken}`;
              transporter.sendMail({
                from: 'JohnCageTributeOrg@gmail.com',
                to: email,
                subject: 'Confirm Email',
                html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
              });
            },
          );
    } catch (error) {
        console.log(error);
    }
}

export const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where:{
                email: req.body.email
            }
        });
        if (!user[0].confirmed) {
            throw new Error('Please confirm your email to login');
        }
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg: "Wrong Password"});
        const userId = user[0].id;
        const username = user[0].username;
        const email = user[0].email;
        const accessToken = jwt.sign({userId, username, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({userId, username, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Users.update({refresh_token: refreshToken},{
            where:{
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({msg:"Email not found"});
    }
}

export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({refresh_token: null},{
        where:{
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}
