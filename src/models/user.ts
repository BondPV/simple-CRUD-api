import { v4 as uuidv4 } from 'uuid';
import { type IUser, users } from '../db/db';

export type UserWithoutIdType = Omit<IUser, 'id'>;

export const getUsers = async (): Promise<IUser[]> => users;

export const getUserById = async (id: string): Promise<IUser | undefined> => users.find(user => user.id === id);

export const createUser = async (username: string, age: number, hobbies: string[]): Promise<IUser> => {
    const newUser: IUser = { id: uuidv4(), username, age, hobbies };

    users.push(newUser);

    return newUser;
};

export const updateUser = async (
    id: string,
    username: string,
    age: number,
    hobbies: string[],
): Promise<null | IUser> => {
    const user = await getUserById(id);

    if (!user) {
        return null;
    }

    user.username = username;
    user.age = age;
    user.hobbies = hobbies;

    return user;
};

export const deleteUser = async (id: string): Promise<boolean> => {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        users.splice(index, 1);

        return true;
    }

    return false;
};
