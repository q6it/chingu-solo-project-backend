import bcrypt from 'bcrypt';
import Boom from '@hapi/boom';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
} from '../../lib/authTokenManager';
import { users, usersTokens } from '../../db/dbMock';
import { verifyUser } from '../helpers/users';

const root = '/v1/auth';

export default [
    {
        method: 'POST',
        path: `${root}/register`,
        config: {
            pre: [
                {
                    method: async (request, h) => {
                        const { email = null, password = null } = request.payload;

                        if (!email || !password) {
                            throw Boom.badRequest('Email or password is missing');
                        }
                        const user = users.filter((u) => u.email === email)[0];
                        if (user) {
                            throw Boom.conflict('Email already in use');
                        }
                        return h.continue;
                    },
                },
            ],
        },
        handler: async (request) => {
            const { email = null, password = null } = request.payload;

            const passwordHash = await bcrypt.hash(password, 10);

            try {
                users.push({ email, password: passwordHash });
                const accessToken = generateAccessToken({ email });

                return {
                    success: true,
                    message: `${email} user has been registered`,
                    accessToken,
                };
            } catch (error) {
                console.log(error);
                Boom.badRequest('Something went terribly wrong');
            }
        },
    },
    {
        method: 'POST',
        path: `${root}/login`,
        config: {
            pre: [
                {
                    method: async (request, h) => {
                        const { email = null, password = null /* , token = null  */ } =
                            request.payload;
                        // const verified = verifyTokenForLogin(token);
                        // console.log('🚀 ~ file: auth.js ~ line 64 ~ method: ~ verified', verified);

                        if (!email || !password) {
                            throw Boom.badRequest('Email or password is missing');
                        }
                        const user = users.filter((u) => u.email === email)[0];
                        console.log('🚀 ~ file: auth.js ~ line 70 ~ method: ~ user', user);
                        if (!user) {
                            throw Boom.notFound('User not found');
                        }
                        return user;
                    },
                },
            ],
        },
        handler: async (request, h) => {
            // try {
            const { email, password } = request.payload;

            const user = users.filter((u) => u.email === email)[0];

            const match = await bcrypt.compare(password, user.password);
            console.log('🚀 ~ file: auth.js ~ line 86 ~ handler: ~ match', match);

            if (match) {
                const accessToken = generateAccessToken({ email });
                let refreshToken = generateRefreshToken({ email });
                console.log('🚀 ~ file: auth.js ~ line 92 ~ handler: ~ refreshToken', refreshToken);
                const userHasToken = verifyUser(refreshToken);

                if (!userHasToken) {
                    usersTokens.push({ userId: email, refreshToken });
                    console.log(
                        '🚀 ~ file: auth.js ~ line 97 ~ handler: ~ usersTokens',
                        usersTokens
                    );
                } else {
                    refreshToken = usersTokens.find((u) => u.userId === email).refreshToken;
                }

                // const refreshToken = generateRefreshToken({ email });
                // usersTokens.push(refreshToken);
                // console.log('🚀 ~ file: auth.js ~ line 17 ~ handler: ~ verified', verified);
                return { accessToken, refreshToken };
            }
            throw Boom.unauthorized('invalid password');
            // } catch (error) {
            //     console.log(error);
            //     throw Boom.badRequest('Something went terribly wrong');
            // }
        },
    },

    // TODO: ditch this request and remove the token on FE
    {
        method: 'DELETE',
        path: `${root}/logout`,
        // options: {
        //     auth: 'my_jwt',
        // }
        handler: async (request, h) => {
            const { refreshToken } = request.payload;
            console.log('🚀 ~ file: auth.js ~ line 121 ~ handler: ~ refreshToken', refreshToken);
            try {
                const removeIndex = usersTokens.findIndex((i) => i.refreshToken === refreshToken);
                console.log('🚀 ~ file: auth.js ~ line 123 ~ handler: ~ usersTokens', usersTokens);
                if (removeIndex >= 0) {
                    usersTokens.splice(removeIndex, 1);
                    return h.response({ success: true }).code(200);
                }
                return h.response({ message: 'user not found' }).code(404);
            } catch (error) {
                console.log(error);
                Boom.badRequest('Something went terribly wrong');
            }
        },
    },
    {
        method: 'POST',
        path: `${root}/refresh-token`,
        // config: {
        //     pre: [{
        //         method: async () => {

        //         }
        //     }]
        // },
        handler: async (request, h) => {
            try {
                const { email } = request.payload;
                const refreshToken = generateRefreshToken({ email });
                const userHasToken = findUserToken(refreshToken);
                if (!userHasToken) {
                    usersTokens.push(refreshToken);
                }
                return { refreshToken };
            } catch (error) {
                Boom.badRequest('Something went terribly wrong');
            }
        },
    },
];
