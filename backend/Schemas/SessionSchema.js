import mongoose from "mongoose";

export const SessionSchema = new mongoose.Schema({
    loginTime: {
        type: String
    },
    logoutTime: {
        type: String
    },
    ipAddress: {
        type: String
    }
})