import jwt from 'jsonwebtoken';

const algorithm = 'HS256';

export const generateAccessToken = (jwtPayload) =>
    jwt.sign(jwtPayload, process.env.JWTSECRETKEY, { algorithm, expiresIn: '5m' });

export const generateRefreshToken = (jwtPayload) =>
    jwt.sign(jwtPayload, process.env.JWTREFRESHTOKEN, { algorithm, expiresIn: '3 days' });

export const verifyAccessToken = (token) => jwt.verify(token, process.env.JWTSECRETKEY);

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWTREFRESHTOKEN);
};
