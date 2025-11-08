import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { bind } from '../decorators/bind';

@customElement('color-pallette')
export class ColorPallette extends LitElement {
    @property({ type: Array })
    colors: string[] = ['white', 'black'];

    @property({ type: String })
    value: string = 'white';

    static styles = css`
        :host {
            display: flex;
            height: 50px;
        }

        input {
            width: 100px;
            display: block;
            padding: 0;
            border: none;
        }

        #input-container {
            display: inline-block;
            height: 100%;
            position: relative;
        }

        #input-container:after {
            content: '';
            position: absolute;
            z-index: 99;
            inset: 0;
            background-color: red;
            background: url(/color-picker-icon.png);
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            pointer-events: none;
        }

        button {
            border: none;
            display: inline-block;
        }

        input,
        button {
            height: 100%;
            width: 100px;
        }

        button:after {
            content: attr(color);
        }

        button[selected] {
            border: 5px solid;
            border-image: conic-gradient(
                rgba(255, 0, 0, 1) 0%,
                rgba(255, 154, 0, 1) 10%,
                rgba(208, 222, 33, 1) 20%,
                rgba(79, 220, 74, 1) 30%,
                rgba(63, 218, 216, 1) 40%,
                rgba(47, 201, 226, 1) 50%,
                rgba(28, 127, 238, 1) 60%,
                rgba(95, 21, 242, 1) 70%,
                rgba(186, 12, 248, 1) 80%,
                rgba(251, 7, 217, 1) 90%,
                rgba(255, 0, 0, 1) 100%
            ) 1;
        }
    `;

    @bind
    onColorInput(e: InputEvent) {
        let color = (e.target as HTMLInputElement).value;
        this.colors.push(color);
        this.requestUpdate('colors');
        this.onButtonPress(color);
    }

    @bind
    onButtonPress(color: string) {
        this.value = color;
        this.dispatchEvent(new InputEvent('input'));
    }

    render() {
        return html`
            <div id="input-container">
                <input type="color" @input="${this.onColorInput}" />
            </div>
            ${this.colors.map(
                (color) => html`
                    <button
                        ?selected="${color === this.value}"
                        @click="${() => this.onButtonPress(color)}"
                        style="background-color: ${color}"></button>
                `
            )}
        `;
    }
}
