import { usersTokens } from '../../db/dbMock';

export const verifyUser = (token) => {
    console.log('🚀 ~ file: users.js ~ line 2 ~ usersTokens', usersTokens);
    const test = usersTokens.some((user) => user.refreshToken === token);
    console.log('🚀 ~ file: users.js ~ line 6 ~ verifyUser ~ test', test);
    return test;
};
