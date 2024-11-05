// postcss.config.js
module.exports = {
  plugins: [require('autoprefixer'), require('tailwindcss'), require('postcss-import'), require('tailwindcss/nesting')],
};
