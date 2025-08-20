import { config as baseConfig } from "@repo/eslint-config/react-internal";

/** @type {import("eslint").Linter.Config} */
export default [
  ...baseConfig,
  {
    ignores: ["src/backgrounds/**", "src/components/GlassSurface.tsx"],
  },
];
