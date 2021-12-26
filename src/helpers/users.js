import { usersTokens } from '../../db/dbMock';

export const verifyUser = (token) => {
    const test = usersTokens.some((user) => user.refreshToken === token);
    return test;
};
