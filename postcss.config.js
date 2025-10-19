/**
 * @type {import('postcss').ProcessOptions}
 */
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
    '@thedutchcoder/postcss-rem-to-px': {
      baseValue: 12
    },

  }
}