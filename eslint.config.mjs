import next from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

// eslint-config-next 16 ships flat configs directly; going through FlatCompat
// re-introduces the legacy loader and blows up on a circular plugin reference.
const config = [
  ...next,
  ...typescript,
  { ignores: ['.next/**', 'node_modules/**', 'design/**', 'scripts/**'] },
];

export default config;
