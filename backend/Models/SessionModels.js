import mongoose from "mongoose";
import { SessionSchema } from "../Schemas/SessionSchema.js";

export const SessionModels = new mongoose.model("SessionModel", SessionSchema);