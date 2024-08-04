import jwt from 'jsonwebtoken';

export const IsAuthenticated = async (req, res, next) => {
    const { authorization } = req.headers;
    const decode = jwt.verify(authorization, process.env.JWT_SECRET);
    req.user = decode;
    next();
}