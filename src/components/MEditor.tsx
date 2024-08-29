import { monaco } from "react-monaco-editor";
export { Editor as MEditor} from "@monaco-editor/react";

/**
 * To apply custom theme to monaco editor
 * 
 * add this to the monaco editor component
 * ```tsx
 * <Editor
 * beforeMount={(monaco) => {
 *  monaco.editor.defineTheme("custom", custom_monaco_theme);
 * }}
 * theme="custom"
 * />
 * ```
 */
export const custom_monaco_theme: monaco.editor.IStandaloneThemeData = {
    base: 'vs-dark',
    inherit: true,
    colors: {
        'editor.foreground': '#F8F8F2',
        'editor.background': '#282A36',
        'editor.selectionBackground': '#44475A',
        'editor.lineHighlightBackground': '#44475A',
        'editorCursor.foreground': '#F8F8F0',
        'editorWhitespace.foreground': '#3B3A32',
        'editorLineNumber.foreground': '#6272A4',
        // intelesense
        'editorSuggestWidget.background': '#282A36',
        'editorSuggestWidget.foreground': '#F8F8F2',
        'editorSuggestWidget.border': '#282A36',
        'editorSuggestWidget.selectedBackground': '#44475A',
    },
    rules: [
        { token: 'comment', foreground: 'ffa500', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff0000' },
        { token: 'string', foreground: 'ff0000' },
    ]
}