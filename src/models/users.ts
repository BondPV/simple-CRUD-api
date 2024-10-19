import { v4 as uuidv4 } from 'uuid';

export interface IUser {
    id: string;
    username: string;
    age: number;
    hobbies: string[] | [];
}

const users: IUser[] = [];

export const getUsers = () => users;

export const getUserById = (id: string) => users.find(user => user.id === id);

export const createUser = (username: string, age: number, hobbies: string[]) => {
    const newUser: IUser = { id: uuidv4(), username, age, hobbies };

    users.push(newUser);

    return newUser;
};

export const updateUser = (id: string, username?: string, age?: number, hobbies?: string[]) => {
    const user = getUserById(id);

    if (!user) {
        return null;
    }

    if (username) {
        user.username = username;
    }

    if (age) {
        user.age = age;
    }

    if (hobbies) {
        user.hobbies = hobbies;
    }
    
    return user;
};

export const deleteUser = (id: string) => {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        users.splice(index, 1);

        return true;
    }

    return false;
};
