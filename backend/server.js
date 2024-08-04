import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { AuthenticationRoutes } from './Routes/AuthenticationRoutes.js';
import { TodoRoutes } from './Routes/TodoRoutes.js';
import cors from 'cors';
import { SessionRoutes } from './Routes/SessionRoutes.js';

const app = express();

dotenv.config({});

mongoose.connect(process.env.MONGO_DB_URL)
    .then(() => {
        console.log("connected successfully!");
    })
    .catch((err) => {
        console.log("error during connection!");
        console.log(err);
    })

app.use(cors())
app.use(express.json());
app.enable('trust proxy');
app.use('/api/auth', AuthenticationRoutes);
app.use('/api/todo', TodoRoutes);
app.use('/api/admin', SessionRoutes);

app.listen(process.env.PORT, () => {
    console.log(`server started successfully at ${process.env.PORT}`);
})