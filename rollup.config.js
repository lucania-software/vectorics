import typescript from "@rollup/plugin-typescript";

/** @type {import("rollup").RollupOptions} */
export default {
    input: "source/index.ts",
    output: {
        file: "build/index.js",
        name: "Vectorics",
        format: "umd",
        sourcemap: false,
        exports: "named"
    },
    plugins: [typescript()]
};