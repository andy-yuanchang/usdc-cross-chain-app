module.exports = {
  '*.+(js|ts|tsx)': 'eslint --fix',
  '*.+(js|json|ts|tsx|scss|css|md|mdx)': 'prettier --write',
  '*.+(ts|tsx)': () => 'tsc --pretty --noEmit',
}
