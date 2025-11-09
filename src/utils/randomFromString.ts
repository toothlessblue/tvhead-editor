export function randomFromString(string: string) {
    return string[Math.floor(Math.random() * string.length)];
}
