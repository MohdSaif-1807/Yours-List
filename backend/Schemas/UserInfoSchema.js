import mongoose from "mongoose";

export const UserInfoSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    todoListCount: {
        type: Number,
        default: 0
    },
    user_role: {
        type: String
    }
})