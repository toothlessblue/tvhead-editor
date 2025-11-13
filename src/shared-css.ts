import { css } from 'lit';

export const SharedCSS = css`
    * {
        --delete-red: #ff5028;
        --good-green: #81ff81;
    }

    .image-button {
        width: 30px;
        height: 30px;
        display: block;
    }

    svg {
        width: 30px;
        height: 30px;
    }

    .pill-button {
        border-radius: 1000px;
        background-color: white;
        display: inline-block;
        color: black;
        padding: 0 10px;
        user-select: none;
        -webkit-user-select: none; /* Safari */
        cursor: pointer;
    }

    .pill-button img, .pill-button svg {
        width: 25px;
        height: 25px;
    }

    .pill-button > * {
        vertical-align: middle;
        display: inline-block;
    }
`;
