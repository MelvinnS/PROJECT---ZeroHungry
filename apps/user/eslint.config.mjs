import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const crossAppAdminPatterns = [
  {
    group: [
      "@zerohungry/admin",
      "@zerohungry/admin/*",
      "**/apps/admin/**",
      "../admin/**",
      "../../admin/**",
      "../../../admin/**",
      "../../../../admin/**",
    ],
    message: "apps/user dilarang meng-import langsung dari apps/admin.",
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
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      "no-restricted-imports": ["error", { patterns: crossAppAdminPatterns }],
    },
  },
  {
    files: ["components/**/*.{ts,tsx}", "hooks/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [...crossAppAdminPatterns, ...noServerPatterns] },
      ],
    },
  },
]);

export default eslintConfig;
