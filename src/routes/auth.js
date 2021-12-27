import bcrypt from 'bcrypt';
import Boom from '@hapi/boom';
import { generateAccessToken, generateRefreshToken } from '../../lib/authTokenManager';
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
            const { email = null, password = null, name = null } = request.payload;

            const passwordHash = await bcrypt.hash(password, 10);
            try {
                users.push({ email, password: passwordHash, name });

                return {
                    success: true,
                    message: `${email} user has been registered`,
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
                    method: async (request) => {
                        const { email = null, password = null } = request.payload;

                        if (!email || !password) {
                            throw Boom.badRequest('Email or password is missing');
                        }
                        const user = users.filter((u) => u.email === email)[0];
                        if (!user) {
                            throw Boom.notFound('User not found');
                        }
                        return user;
                    },
                },
            ],
        },
        handler: async (request) => {
            const { email, password } = request.payload;

            const user = users.filter((u) => u.email === email)[0];
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                const accessToken = generateAccessToken({ email });
                let refreshToken = generateRefreshToken({ email });
                const userHasToken = verifyUser(refreshToken);

                if (!userHasToken) {
                    usersTokens.push({ userId: email, refreshToken });
                } else {
                    refreshToken = usersTokens.find((u) => u.userId === email).refreshToken;
                }
                return { accessToken, refreshToken, name: user.name, email: user.email };
            }
            throw Boom.unauthorized('invalid password');
        },
    },
    {
        method: 'POST',
        path: `${root}/refresh-token`,
        handler: async (request) => {
            try {
                const { email } = request.payload;
                const refreshToken = generateRefreshToken({ email });
                // const userHasToken = findUserToken(refreshToken);
                // if (!userHasToken) {
                //     usersTokens.push(refreshToken);
                // }
                return { refreshToken };
            } catch (error) {
                Boom.badRequest('Something went terribly wrong');
            }
        },
    },
];
