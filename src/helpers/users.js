import { usersTokens } from '../../db/dbMock';

export const verifyUser = (token) => {
    return usersTokens.some((user) => user.refreshToken === token);
};
