import Boom from '@hapi/boom';
import { items } from '../helpers/dbMock';

const root = '/v1/items';

export default [
    {
        method: 'GET',
        path: `${root}/all`,
        handler: async () => {
            try {
                return { success: true, items };
            } catch (error) {
                console.log(error);
                Boom.badRequest('Something went terribly wrong');
            }
        },
    },
    {
        method: 'POST',
        path: `${root}/save-item`,
        handler: async (request) => {
            try {
                const { item } = request.payload;
                items.push(item);
                return { success: true, message: 'item saved' };
            } catch (error) {
                console.log(error);
                Boom.badRequest('Something went terribly wrong');
            }
        },
    },
];
