import ts from "typescript-eslint";
import js from "@eslint/js";
import globals from "globals";
import { includeIgnoreFile } from "@eslint/compat"
import { fileURLToPath } from "url";
import prettier from "eslint-config-prettier";
const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

export default ts.config(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...ts.configs.recommended,
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  {
    files: ["**/*.ts"],
    ignores: ["eslint.config.js"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: [".ts"],
        parser: ts.parser
      }
    }
  }
)