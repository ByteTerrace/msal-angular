module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended", // needs to be the last extension
    ],
    parser: "@typescript-eslint/parser",
    plugins: [
        "@typescript-eslint",
        "prettier",
    ],
    root: true,
};
