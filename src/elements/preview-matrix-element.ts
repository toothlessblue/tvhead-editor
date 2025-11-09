import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { MatrixElementData } from '../utils/matrix-element-data';
import { bind } from '../decorators/bind';

let FRAME_TIME_MS = 1000 / 60;
let FRAME_NUM = 0;
function incrementFrame() {
    FRAME_NUM++;
}
setInterval(incrementFrame, FRAME_TIME_MS);

@customElement('preview-matrix-element')
export class PreviewMatrixElement extends LitElement {
    @property({type: Number })
    currentFrame: number = 0;

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

    animationInterval: any;

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

    @bind
    advanceFrame() {
        let maxFrames = this.data.images.length;
        let frameNum = Math.floor(FRAME_NUM / this.data.fps);
        this.currentFrame = frameNum % maxFrames; 

        this.animationInterval = requestAnimationFrame(this.advanceFrame);
    }

    connectedCallback(): void {
        super.connectedCallback();

        this.animationInterval = requestAnimationFrame(this.advanceFrame);
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();

        cancelAnimationFrame(this.animationInterval);
    }

    render() {
        return html` <div id="frame" style="background-image: url(${this.data.images[this.currentFrame]})"></div> `;
    }
}
