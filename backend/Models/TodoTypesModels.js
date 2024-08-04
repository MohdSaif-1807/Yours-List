import mongoose from "mongoose";
import { TodoCategorySchema } from "../Schemas/TodoCategorySchema.js";

export const TodoTypesModels = new mongoose.model("TodoTypesModel", TodoCategorySchema);