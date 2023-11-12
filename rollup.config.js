import TypeScriptPlugin from "@rollup/plugin-typescript";
import { nodeResolve as NodeResolvePlugin } from "@rollup/plugin-node-resolve";
import CommonJsPlugin from "@rollup/plugin-commonjs";
import { babel as BabelPlugin } from "@rollup/plugin-babel";

/** @type {import("rollup").RollupOptions} */
export default {
    input: "./source/index.ts",
    output: {
        file: "./build/index.js",
        name: "Vectorics",
        format: "umd"
    },
    plugins: [
        TypeScriptPlugin({ tsconfig: "./source/tsconfig.json" }),
        NodeResolvePlugin(),
        CommonJsPlugin(),
        BabelPlugin({ babelHelpers: "bundled", presets: ["@babel/preset-env"] })
    ]
};