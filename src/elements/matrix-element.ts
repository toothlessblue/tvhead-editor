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
    `;

    async editImage(i: number) {
        let editor = ImageEditor.popoverEditor(this.data.images[i], this.data.width, this.data.height);
        await editor.waitForExit();
        this.data.images[i] = editor.getImage();
        editor.remove();
        this.requestUpdate('data');
        this.dispatchEvent(new Event('image-changed'));
    }

    render() {
        return html`
            ${this.data.images.map(
                (_, i) => html`
                    <div @click="${() => this.editImage(i)}" class="frame" style="background-image: url(${_});"></div>
                `
            )}
        `;
    }
}
