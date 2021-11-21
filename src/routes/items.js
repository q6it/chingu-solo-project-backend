import Boom from '@hapi/boom';

const root = '/v1/items';

export default [
    {
        method: 'GET',
        path: `${root}/all`,
        handler: async (request) => {
            const items = [
                { id: 0, title: 'test1', body: 'lorem ipsum dollar ...' },
                {
                    id: 1,
                    title: 'test2',
                    body: 'lorem ajskdfalskjdfasdf afdjklasdjfkjk dollar ...',
                },
            ];
            try {
                return { success: true, items };
            } catch (error) {
                console.log(error);
                Boom.badRequest('Something went terribly wrong');
            }
        },
    },
];
