/**
* Removes header from data url
*/
export function trimDataURL(dataUrl: string) {
    return dataUrl.substring(dataUrl.indexOf(','));
}
