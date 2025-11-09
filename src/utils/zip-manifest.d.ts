import type { MatrixElementData } from "./matrix-element-data";

export interface ManifestElementData extends MatrixElementData {
    // Happens to be the exact same type structure,
    // but images is an array of filenames instead
    // of an array of data urls.
}

export interface ZipManifest {
    elements: MatrixElementData[],
}
