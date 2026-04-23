import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  
  // Override default ignores
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "node_modules/**",
    "next-env.d.ts",
    "*.config.js",
    "*.config.mjs",
    "*.config.ts",
    "public/**",
    "**/*.d.ts",
  ]),
  
  // কাস্টম রুলস
  {
    rules: {
      // TypeScript রুলস
      "@typescript-eslint/no-explicit-any": "off", // any ব্যবহার করতে দেবে
      "@typescript-eslint/no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_" 
      }],
      
      // React রুলস
      "react/no-unescaped-entities": "off", // বাংলা টেক্সটে সমস্যা না করতে
      "react/display-name": "off", // memo কম্পোনেন্টের জন্য
      "react-hooks/exhaustive-deps": "warn", // useEffect ডিপেন্ডেন্সি চেক
      
      // সাধারণ রুলস
      "no-console": ["warn", { allow: ["warn", "error"] }], // console.log ওয়ার্নিং
      "prefer-const": "warn",
      "no-var": "error",
    },
  },
]);

export default eslintConfig;