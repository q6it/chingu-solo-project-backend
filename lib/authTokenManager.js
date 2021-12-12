import jwt from 'jsonwebtoken';

const algorithm = 'HS256';
// const tapError = (error) => _.tap(error, console.error);

export const generateAccessToken = (jwtPayload) =>
    // console.log('🚀 ~ file: authTokenManager.js ~ line 7 ~ jwtPayload', jwtPayload);
    // return new Promise((resolve, reject) => {
    jwt.sign(
        jwtPayload,
        process.env.JWTSECRETKEY,
        { algorithm, expiresIn: '30s' }
        // (err, token) => (err ? reject(console.error(err)) : resolve(token))
    );
// });

export const generateRefreshToken = (jwtPayload) =>
    // new Promise((resolve, reject) => {
    jwt.sign(
        jwtPayload,
        process.env.JWTREFRESHTOKEN,
        { algorithm, expiresIn: '3 days' }
        // (err, res) => (err ? reject(console.error(err)) : resolve(res))
    );
// });

export const verifyAccessToken = (token) =>
    // new Promise((resolve, reject) =>
    // eslint-disable-next-line no-promise-executor-return
    jwt.verify(
        token,
        process.env.JWTSECRETKEY
        // ignoreExpiration ? { ignoreExpiration: true } : undefined,
        // (err, res) => (err ? reject(console.error(err)) : resolve(res))
    );
// );

export const verifyRefreshToken = (token) => {
    // new Promise((resolve, reject) =>
    // eslint-disable-next-line no-promise-executor-return
    return jwt.verify(
        token,
        process.env.JWTREFRESHTOKEN
        // ignoreExpiration ? { ignoreExpiration: true } : undefined,
        // (err, res) => (err ? reject(console.error(err)) : resolve(res))
    );
    // );
};
