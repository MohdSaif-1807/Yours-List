
import { createClient } from '@supabase/supabase-js'
import { UserInfoModels } from '../Models/UserInfoModels.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto-js';
import { SessionModels } from '../Models/SessionModels.js';
import mongoose from 'mongoose';
// export const SupabaseSignup = async (req, res) => {
//     try {
//         // const supabaseUrl = process.env.SUPABASE_URL;
//         // const supabaseKey = process.env.SUPABASE_API_KEY;
//         // const supabase = await createClient(supabaseUrl, supabaseKey);
//         // const bodyData = await req.body;
//         // console.log(bodyData);
//         // const { data, error } = await supabase.auth.signUp({
//         //     email: bodyData?.email,
//         //     password: bodyData?.password,
//         // })

//         // console.log(data);
//         // console.log(error);

//         // res.status(200).json({
//         //     data: data,
//         //     error: error,
//         //     message: 'Working correctly!!'
//         // })

//     } catch (err) {
//         console.log(err);
//         res.status(400).json({
//             message: err
//         })
//     }
// }

export const UserAuthenticationRegistration = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const hashedPassword = crypto.AES.encrypt(password, process.env.PASSWORD_SECRET_KEY).toString();
        const userInformation = new UserInfoModels({
            'firstName': firstName,
            'lastName': lastName,
            'email': email,
            'user_role': 'user',
            'password': hashedPassword
        });
        await userInformation.save();
        res.status(200).json({
            message: 'User Registered Successfully'
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: "something went wrong!!",
            err: err
        })
    }
}

export const UserAuthenticationLogin = async (req, res) => {

    try {
        const { email, password } = req.body;
        const data = await UserInfoModels.findOne({ email: email });
        if (data) {
            const date_time = new Date();
            const decrypted = crypto.AES.decrypt(data.password, process.env.PASSWORD_SECRET_KEY)
                .toString(crypto.enc.Utf8);
            if (password === decrypted) {
                if (data?.user_role !== "admin") {
                    const sessionModel = new SessionModels({
                        'loginTime': date_time.getHours() + ":" + date_time.getMinutes() + ":" + date_time.getSeconds(),
                        'ipAddress': req.ip
                    })
                    const saveSession = await sessionModel.save();
                    const jwt_token = await jwt.sign({ _id: data._id, sessionId: saveSession._id }, process.env.JWT_SECRET);
                    res.status(200).json({
                        message: 'record found successfully',
                        'jwt_token': jwt_token,
                        data,
                    })
                }
                else {
                    const jwt_token = await jwt.sign({ _id: data._id }, process.env.JWT_SECRET);

                    res.status(200).json({
                        message: 'record found successfully',
                        'jwt_token': jwt_token,
                        data,
                    })
                }

            }
            else {
                res.status(400).json({
                    message: 'Incorrect password!!'
                })
            }
        }
        else {
            res.status(400).json({
                message: 'no record found with the following email',
            })
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: 'something went wrong',
            err: err
        })
    }
}

export const UserAuthenticationLogout = async (req, res) => {
    try {
        const { _id, sessionId } = req.user;
        const tempID = new mongoose.Types.ObjectId(_id);
        const data = await UserInfoModels.findOne({ _id: tempID });
        if (data?.user_role !== "admin") {
            const date_time = new Date();
            const mongoId = new mongoose.Types.ObjectId(sessionId);
            const tempData = await SessionModels.findOne({ _id: mongoId });
            tempData.logoutTime = date_time.getHours() + ":" + date_time.getMinutes() + ":" + date_time.getSeconds();
            await tempData.save();
        }
        res.status(200).json({
            'message': 'logout successfull'
        })
    } catch (err) {
        res.status(403).json({
            'message': 'something went wrong',
            'error': err
        })
    }
}



export const getUserDetails = async (req, res) => {
    try {
        const { _id } = req.user;
        const mongoId = new mongoose.Types.ObjectId(_id);
        const data = await UserInfoModels.findOne({ '_id': mongoId });
        res.status(200).json({
            'message': 'data fetched successfully',
            'data': data
        });
    }
    catch (err) {
        console.log(err);
        res.status(403).json({
            'message': 'something went wrong!',
            'error': err
        })
    }
}