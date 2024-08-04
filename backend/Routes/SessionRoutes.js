import express from 'express';
import { getAllSessions } from '../Controllers/Sessions.js';
export const SessionRoutes = express.Router();

SessionRoutes.get('/get-all-sessions', getAllSessions);