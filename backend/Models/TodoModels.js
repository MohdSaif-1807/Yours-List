import mongoose from "mongoose";
import { TodoSchema } from "../Schemas/TodoSchema.js";

export const TodoModel = new mongoose.model("TodoModel", TodoSchema);