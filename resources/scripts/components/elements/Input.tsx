import tw from 'twin.macro';
import { tokens } from '@/theme';
import styled, { css } from 'styled-components/macro';

export interface Props {
    isLight?: boolean;
    hasError?: boolean;
}

const light = css<Props>`
    background-color: ${tokens.colors.background};
    border-color: ${tokens.colors.border};
    color: ${tokens.colors.text};
    &:focus {
        border-color: ${tokens.colors.primary};
    }

    &:disabled {
        background-color: ${tokens.colors.surface};
        border-color: ${tokens.colors.border};
    }
`;

const checkboxStyle = css<Props>`
    ${tw`cursor-pointer appearance-none inline-block align-middle select-none flex-shrink-0 w-4 h-4 rounded-sm`};
    color: ${tokens.colors.primary};
    background-color: ${tokens.colors.muted};
    border: 1px solid ${tokens.colors.border};
    color-adjust: exact;
    background-origin: border-box;
    transition: all 75ms linear, box-shadow 25ms linear;

    &:checked {
        ${tw`border-transparent bg-no-repeat bg-center`};
        background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
        background-color: currentColor;
        background-size: 100% 100%;
    }

    &:focus {
        ${tw`outline-none`};
        border-color: ${tokens.colors.primary};
        box-shadow: 0 0 0 1px ${tokens.components.focusRingColor};
    }
`;

const inputStyle = css<Props>`
    // Reset to normal styling.
    resize: none;
    ${tw`appearance-none outline-none w-full min-w-0`};
    ${tw`p-2.5 border-2 rounded text-sm transition-all duration-150`};
    ${tw`shadow-none focus:ring-0`};
    background-color: ${tokens.colors.surface};
    border-color: ${tokens.colors.border};
    color: ${tokens.colors.text};
    &:hover:not(:disabled):not(:read-only) {
        border-color: ${tokens.colors.muted};
    }

    & + .input-help {
        ${tw`mt-1 text-xs`};
        color: ${(props) => (props.hasError ? tokens.status.dangerText : tokens.colors.muted)};
    }

    &:required,
    &:invalid {
        ${tw`shadow-none`};
    }

    &:not(:disabled):not(:read-only):focus {
        ${tw`shadow-md`};
        border-color: ${tokens.colors.primary};
        box-shadow: 0 0 0 2px ${tokens.components.focusRingColor};
        ${(props) =>
            props.hasError &&
            css`
                border-color: ${tokens.status.dangerBorder};
                box-shadow: 0 0 0 2px ${tokens.status.dangerTextStrong};
            `};
    }

    &:disabled {
        ${tw`opacity-75`};
    }

    ${(props) => props.isLight && light};
    ${(props) =>
        props.hasError &&
        css`
            color: ${tokens.status.dangerTextStrong};
            border-color: ${tokens.status.dangerBorder};

            &:hover {
                border-color: ${tokens.status.dangerTextStrong};
            }
        `};
`;

const Input = styled.input<Props>`
    &:not([type='checkbox']):not([type='radio']) {
        ${inputStyle};
    }

    &[type='checkbox'],
    &[type='radio'] {
        ${checkboxStyle};

        &[type='radio'] {
            ${tw`rounded-full`};
        }
    }
`;
const Textarea = styled.textarea<Props>`
    ${inputStyle}
`;

export { Textarea };
export default Input;
