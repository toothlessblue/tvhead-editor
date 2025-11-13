import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { downloadFileIcon, importFileIcon, uploadIcon } from '../utils/icons';
import { SharedCSS } from '../shared-css';
import { VirtualMatrix } from './virtual-matrix';
import { createRef, ref } from 'lit/directives/ref.js';

@customElement('component-main')
export class main extends LitElement {
    virtualMatrix = createRef<VirtualMatrix>();

    static styles = [SharedCSS, css`
        :host {
            display: block;
            width: 100%;
            height: 100%;
        }

        #virtual-matrix {
            background-color: red;
            height: 100%;
            width: 100%;
        }

        #header {
            display: flex;
            margin: 10px;
        }
    `];

    render() {
        return html`
            <div id="header">
                <div class="pill-button" style="margin-right: 10px;" @click="${() => this.virtualMatrix.value?.download()}">
                    ${unsafeSVG(downloadFileIcon)}
                    <p>Export</p>
                </div>
                <div class="pill-button" @click="${() => this.virtualMatrix.value?.clickFileInput()}">
                    ${unsafeSVG(importFileIcon)}
                    <p>Import</p>
                </div>
                <div class="pill-button" style="margin-left: auto" @click="${() => this.virtualMatrix.value?.uploadToScreen()}">
                    ${unsafeSVG(uploadIcon)}
                    <p>Upload to my face!</p>
                </div>
            </div>
            
            <virtual-matrix ${ref(this.virtualMatrix)}></virtual-matrix>
        `;
    }
}
