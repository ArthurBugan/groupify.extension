/**
 * @type {import('postcss').ProcessOptions}
 */
module.exports = {
  plugins: {
    tailwindcss: {},
    '@thedutchcoder/postcss-rem-to-px': {
      baseValue: 12
    },
  }
}