import mongoose from "mongoose";

export const TodoCategorySchema = new mongoose.Schema({
    todoCategories: {
        type: String,
    },
    personId: {
        type: String
    },
    count: {
        type: Number,
        default: 0
    }
})