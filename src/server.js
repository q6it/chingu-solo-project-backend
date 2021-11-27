import Hapi from '@hapi/hapi';
// import '../lib/log';
import routes from './routes';

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

    // server.auth.strategy('jwt', config.authScheme)

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
