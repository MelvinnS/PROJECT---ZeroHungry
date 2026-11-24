import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

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
      "no-restricted-imports": [
        "error",
        {
          patterns: [
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
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
