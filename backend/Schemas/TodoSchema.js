import mongoose from "mongoose";

export const TodoSchema = new mongoose.Schema({
    task: {
        type: String
    },
    personId: {
        type: String,
    },
    task_date: {
        type: Date
    },
    task_from_time: {
        type: String
    },
    task_to_time: {
        type: String
    },
    task_category: {
        type: String
    }
})