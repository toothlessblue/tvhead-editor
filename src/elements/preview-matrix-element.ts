import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { MatrixElementData } from '../utils/matrix-element-data';

@customElement('preview-matrix-element')
export class PreviewMatrixElement extends LitElement {
    @property({ type: Object })
    data: MatrixElementData = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fps: 10,
        tags: [],
        images: [],
    };

    static styles = css`
        :host {
            display: block;
            position: relative;
        }

        #frame {
            background-size: cover;
            background-repeat: no-repeat;
            image-rendering: pixelated;
            display: block;
            position: absolute;
            inset: 0;
        }
    `;

    connectedCallback(): void {
        super.connectedCallback();

        setInterval(() => {
            this.requestUpdate('data');
        }, 1000);
    }

    render() {
        return html` <div id="frame" style="background-image: url(${this.data.images[0]})"></div> `;
    }
}
