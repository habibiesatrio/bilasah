const appRoot = __dirname;

module.exports = {
    plugins: {
        '@tailwindcss/postcss': {
            base: appRoot,
        },
        autoprefixer: {},
    },
}
