import Boom from '@hapi/boom';
import jwt from 'jsonwebtoken';
import { items } from '../../db/dbMock';

const root = '/v1/items';

export default [
    {
        method: 'GET',
        path: `${root}/all`,
        options: {
            auth: 'my_jwt',
        },
        handler: async (request) => {
            const { authorization } = request.headers;
            const token = authorization && authorization.split(' ')[1];
            const {
                payload: { email },
            } = jwt.decode(token, { complete: true });

            // const { email } = request.payload;
            // console.log('🚀 ~ file: items.js ~ line 15 ~ handler: ~ email', email);
            try {
                return { success: true, items: items.filter((item) => item.userId === email) };
            } catch (error) {
                console.log(error);
                Boom.badRequest('Something went terribly wrong');
            }
        },
    },
    {
        method: 'POST',
        path: `${root}/save-item`,
        options: {
            auth: 'my_jwt',
        },
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
