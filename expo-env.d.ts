/// <reference types="expo-router/types" />

// This file is required for typed Expo routes & runtime environment variables.
// Touch this file is fine, but DO NOT delete it.

// Allow importing TTF and other asset files as default exports
declare module "*.ttf" {
  const value: string;
  export default value;
}

declare module "*.otf" {
  const value: string;
  export default value;
}

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

declare module "*.json" {
  const value: Record<string, string>;
  export default value;
}
