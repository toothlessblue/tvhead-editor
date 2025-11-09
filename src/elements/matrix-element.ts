import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { MatrixElementData } from '../utils/matrix-element-data';
import { ImageEditor } from './image-editor';

@customElement('matrix-element')
export class MatrixElement extends LitElement {
    @property({ type: Object })
    data: MatrixElementData = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        tags: [],
        images: [],
        fps: 10,
    };

    static styles = css`
        .frame {
            width: 100px;
            height: 100px;
            background-size: contain;
            background-repeat: no-repeat;
        }

        .frame-container {
            position: relative;
        }

        .frame-container .duplicate.button {
            top: 0;
        }

        .frame-container .delete.button {
            top: 40px;
        }

        .frame-container .button {
            width: 30px;
            position: absolute;
            left: 0;
            transform: translate(-50%);
        }
    `;

    async editImage(i: number) {
        let editor = ImageEditor.popoverEditor(this.data.images[i], this.data.width, this.data.height);
        await editor.waitForExit();
        this.data.images[i] = editor.getImage();
        editor.remove();
        this.requestUpdate('data');
        this.dispatchEvent(new Event('image-changed'));
    }

    addFrame() {
        // Blank image
        this.data.images.push('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
        this.requestUpdate('data');
    }

    duplicateFrame(image: string) {
        this.data.images.push(image);
        this.requestUpdate('data');
    }

    deleteFrame(image: string) {
        let index = this.data.images.findIndex((_) => _ === image);
        if (index === -1) {
            console.warn("Tried to delete image that doesn't exist in this element");
            return;
        }

        this.data.images.splice(index, 1);
        this.requestUpdate('data');
    }

    render() {
        return html`
            ${this.data.images.map(
                (_, i) => html`
                    <div class="frame-container">
                        <img
                            class="duplicate button"
                            @click="${() => this.duplicateFrame(_)}"
                            src="/duplicate-icon.svg" />
                        <img class="delete button" @click="${() => this.deleteFrame(_)}" src="/red-cross.svg" />
                        <div
                            @click="${() => this.editImage(i)}"
                            class="frame"
                            style="background-image: url(${_});"></div>
                    </div>
                `
            )}
            <button @click="${this.addFrame}">Add frame</button>
        `;
    }
}
