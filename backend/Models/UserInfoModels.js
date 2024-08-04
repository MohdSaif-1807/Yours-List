import mongoose from "mongoose";
import { UserInfoSchema } from "../Schemas/UserInfoSchema.js";

export const UserInfoModels = new mongoose.model("UserInfo", UserInfoSchema);
