import typescript from "rollup-plugin-typescript";

export default {
  input: "index.ts",
  external: ["request"],
  output: { file: "./dist/index.js", format: "cjs" },
  plugins: [
    typescript({
      project: "./tsconfig.prod.json",
    }),
  ],
};
