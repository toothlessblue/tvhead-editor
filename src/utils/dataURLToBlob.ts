export function dataURLToBlob(url: string) {
    let contentType = url.substring(url.indexOf(":")+1, url.indexOf(";"));
    let byteChars = atob(url);
    let byteNums = new Uint8Array(Array.from(byteChars).map(_ => _.charCodeAt(0)));
    return new Blob([byteNums], {type: contentType});
}
