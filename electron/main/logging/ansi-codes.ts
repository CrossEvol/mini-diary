export const ANSI_CODES = {
    // Text Colors
    textColors: {
        black: '\x1b[30m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m',
        default: '\x1b[39m', // Reset to default text color
    },

    // Bright Text Colors
    brightTextColors: {
        brightBlack: '\x1b[90m',
        brightRed: '\x1b[91m',
        brightGreen: '\x1b[92m',
        brightYellow: '\x1b[93m',
        brightBlue: '\x1b[94m',
        brightMagenta: '\x1b[95m',
        brightCyan: '\x1b[96m',
        brightWhite: '\x1b[97m',
    },

    // Background Colors
    backgroundColors: {
        bgBlack: '\x1b[40m',
        bgRed: '\x1b[41m',
        bgGreen: '\x1b[42m',
        bgYellow: '\x1b[43m',
        bgBlue: '\x1b[44m',
        bgMagenta: '\x1b[45m',
        bgCyan: '\x1b[46m',
        bgWhite: '\x1b[47m',
        defaultBg: '\x1b[49m', // Reset to default background color
    },

    // Bright Background Colors
    brightBackgroundColors: {
        bgBrightBlack: '\x1b[100m',
        bgBrightRed: '\x1b[101m',
        bgBrightGreen: '\x1b[102m',
        bgBrightYellow: '\x1b[103m',
        bgBrightBlue: '\x1b[104m',
        bgBrightMagenta: '\x1b[105m',
        bgBrightCyan: '\x1b[106m',
        bgBrightWhite: '\x1b[107m',
    },

    // Text Styles
    textStyles: {
        reset: '\x1b[0m', // Reset all styles
        bold: '\x1b[1m',
        dim: '\x1b[2m',
        italic: '\x1b[3m',
        underline: '\x1b[4m',
        inverse: '\x1b[7m', // Invert background and foreground colors
        hidden: '\x1b[8m',
        strikethrough: '\x1b[9m',
    },
}
