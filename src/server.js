import Hapi from '@hapi/hapi';
import Jwt from '@hapi/jwt';
import routes from './routes';
import { verifyRefreshToken } from '../lib/authTokenManager';
import { verifyUser } from './helpers/users';

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3001,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with'],
            },
        },
    });

    await server.register(Jwt);
    server.auth.strategy('my_jwt', 'jwt', {
        keys: [process.env.JWTSECRETKEY, process.env.JWTREFRESHTOKEN],
        verify: false,
        validate: (artifacts) => {
            let isValid;
            const { token } = artifacts;
            const userHasToken = verifyUser(token);
            if (!userHasToken) {
                return {
                    isValid: false,
                    credentials: { username: artifacts.decoded.payload.email },
                };
            }

            const refreshTokenVerified = verifyRefreshToken(token);

            if (refreshTokenVerified) {
                isValid = true;
            } else {
                isValid = false;
            }
            return {
                isValid,
                credentials: { username: artifacts.decoded.payload.email },
            };
        },
    });

    routes.forEach((route) => {
        console.log(`attaching ${route.method} ${route.path}`);
        server.route(route);
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
