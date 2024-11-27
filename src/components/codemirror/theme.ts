import { EditorView } from "codemirror";

// colors: {
//     'editor.foreground': '#F8F8F2',
//     'editor.background': '#282A36',
//     'editor.selectionBackground': '#44475A',
//     'editor.lineHighlightBackground': '#44475A',
//     'editorCursor.foreground': '#F8F8F0',
//     'editorWhitespace.foreground': '#3B3A32',
//     'editorLineNumber.foreground': '#6272A4',
//     // intelesense
//     'editorSuggestWidget.background': '#282A36',
//     'editorSuggestWidget.foreground': '#F8F8F2',
//     'editorSuggestWidget.border': '#282A36',
//     'editorSuggestWidget.selectedBackground': '#44475A',
// },
// rules: [
//     { token: 'comment', foreground: 'ffa500', fontStyle: 'italic' },
//     { token: 'keyword', foreground: 'ff0000' },
//     { token: 'string', foreground: 'ff0000' },
// ]

const codemirrorTheme = EditorView.theme({
    ".cm-editor": {
        height: "100%",
    },

    ".cm-scroller": {
        backgroundColor: "var(--editor-bkg)",
        color: "#F8F8F2",
        height: "100%",
    },

    ".cm-gutters": {
        backgroundColor: "#282A36",
        color: "#F8F8F2",
    },
    ".cm-activeLineGutter": {
        backgroundColor: "#44475A",
    },
    ".cm-cursor": {
        backgroundColor: "white",
        borderLeft: "solid 2px #F8F8F0",
    },

    ".cm-selectionBackground": {
        backgroundColor: "#44475A",
    },
    // focused selection background
    ".cm-focused .cm-selectionBackground": {
        backgroundColor: "#282A36 !important",
    },
    
})

export default codemirrorTheme;