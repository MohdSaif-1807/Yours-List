import express from 'express';
import { UserAuthenticationLogin, UserAuthenticationLogout, UserAuthenticationRegistration, getUserDetails } from '../Controllers/Authentication.js';
import { IsAuthenticated } from '../Middlewares/IsAuthenticated.js';

export const AuthenticationRoutes = express.Router();

AuthenticationRoutes.post('/register', UserAuthenticationRegistration);
AuthenticationRoutes.post('/login', UserAuthenticationLogin);
AuthenticationRoutes.get('/logout', IsAuthenticated, UserAuthenticationLogout);
AuthenticationRoutes.get('/user-info', IsAuthenticated, getUserDetails);

