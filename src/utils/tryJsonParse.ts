export function tryJsonParse<T = any>(stringJson: string): T | null {
    try {
        return JSON.parse(stringJson) as T;
    } catch (e) {
        return null;
    }
}
