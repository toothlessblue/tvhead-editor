import type { Color } from './color';

function componentToHex(c: number) {
    let hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
}

export function rgbToHex(color: Color) {
    return '#' + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
}
