import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigRules } from "@eslint/compat";
import jest from 'eslint-plugin-jest';


export default [
{ 
    files: ["*/**/*.{js,mjs,cjs,jsx}"],
    languageOptions: { 
    parserOptions: { ecmaFeatures: { jsx: true } } ,
    globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node
    }},

    plugins: { jest },
    rules: {
    ...jest.configs.recommended.rules,
    ...pluginJs.configs.recommended.rules
    }
},
    ...fixupConfigRules(pluginReactConfig),
];