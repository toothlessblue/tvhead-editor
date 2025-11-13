import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { MatrixElementData } from '../utils/matrix-element-data';
import { ImageEditor } from './image-editor';
import { confirmAlert } from '../decorators/confirm-alert';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { copyIcon, plusCircleIcon, trashIcon } from '../utils/icons';
import { SharedCSS } from '../shared-css';

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

    static styles = [
        SharedCSS,
        css`
            .frame {
                width: 100px;
                height: 100px;
                background-size: contain;
                background-repeat: no-repeat;
                image-rendering: pixelated;
            }

            .frame-container {
                position: relative;
            }

            .frame-container .duplicate.button {
                top: 0;
                fill: var(--good-green);
            }

            .frame-container .delete.button {
                top: 40px;
                fill: var(--delete-red);
            }

            .frame-container .button {
                width: 30px;
                position: absolute;
                left: 0;
                transform: translate(-50%);
                fill: white;
                stroke: black;
                stroke-width: 10px;
            }

            #addFrameButton {
                width: 30px;
                height: 30px;
                margin: 10px auto;
                display: block;
                fill: var(--good-green);
            }
        `,
    ];

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

    @confirmAlert('Are you sure you want to delete this frame?')
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
                        <div class="button duplicate" @click="${() => this.duplicateFrame(_)}">
                            ${unsafeSVG(copyIcon)}
                        </div>
                        <div class="button delete" @click="${() => this.deleteFrame(_)}">${unsafeSVG(trashIcon)}</div>
                        <div
                            @click="${() => this.editImage(i)}"
                            class="frame"
                            style="background-image: url(${_});"></div>
                    </div>
                `
            )}
            <div id="addFrameButton" @click="${this.addFrame}">${unsafeSVG(plusCircleIcon)}</div>
        `;
    }
}
