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

            try {
                return { success: true, items: items.filter((item) => item.userId === email) };
            } catch (error) {
                console.log(error);
                throw Boom.badRequest('Something went terribly wrong');
            }
        },
    },
    {
        method: 'POST',
        path: `${root}/save`,
        options: {
            auth: 'my_jwt',
        },
        handler: async (request) => {
            try {
                const item = request.payload;
                items.push(item);
                return { success: true, message: 'item saved' };
            } catch (error) {
                console.log(error);
                throw Boom.badRequest('Something went terribly wrong');
            }
        },
    },
    {
        method: 'PUT',
        path: `${root}/update`,
        options: {
            auth: 'my_jwt',
        },
        handler: async (request) => {
            const item = request.payload;
            const { id = null, userId = null } = item;
            if (!userId || typeof id !== 'number') {
                throw Boom.badRequest('Post id or userID is missing');
            }
            const itemIndex = items.findIndex((i) => i.id === id && i.userId === userId);
            if (itemIndex >= 0) {
                items[itemIndex] = item;
                return { success: true, message: `${id} item updated` };
            }
            throw Boom.badRequest('No item found');
        },
    },
    {
        method: 'DELETE',
        path: `${root}/delete`,
        options: {
            auth: 'my_jwt',
        },
        handler: async (request) => {
            const { id = null, userId = null } = request.payload;
            if (!userId || typeof id !== 'number') {
                throw Boom.badRequest('Post id or userID is missing');
            }
            const itemIndex = items.findIndex((i) => i.id === id && i.userId === userId);
            if (itemIndex >= 0) {
                items.splice(itemIndex, 1);
                return { success: true, message: `${id} item deleted` };
            }
            throw Boom.badRequest('No item found');
        },
    },
];
