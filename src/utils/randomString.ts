import { randomFromString } from "./randomFromString";

export function randomString(length = 20, chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') {
    let string = '';
    for (let i = 0; i < length; i++) {
        string += randomFromString(chars);
    }
    return string;
}
