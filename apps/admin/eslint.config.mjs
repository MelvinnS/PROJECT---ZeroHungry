import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const crossAppUserPatterns = [
  {
    group: [
      "@zerohungry/user",
      "@zerohungry/user/*",
      "**/apps/user/**",
      "../user/**",
      "../../user/**",
      "../../../user/**",
      "../../../../user/**",
    ],
    message: "apps/admin dilarang meng-import langsung dari apps/user.",
  },
];

const noServerPatterns = [
  {
    group: [
      "@/server/*",
      "@/server/**",
      "../server/**",
      "../../server/**",
      "../../../server/**",
      "../../../../server/**",
    ],
    message: "components/, hooks/, dan lib/ dilarang meng-import modul server/.",
  },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      "no-restricted-imports": ["error", { patterns: crossAppUserPatterns }],
    },
  },
  {
    files: ["components/**/*.{ts,tsx}", "hooks/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [...crossAppUserPatterns, ...noServerPatterns] },
      ],
    },
  },
]);

export default eslintConfig;
