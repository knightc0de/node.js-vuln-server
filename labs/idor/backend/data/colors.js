/**
 * @file colors.js
 * @description a file full of ansii escape codes for diffrent colors
 */

/**
 * ansii codes for colors
 * @namespace
 * @property {string} reset - resets the color to defualt
 * @property {string} bold - makes text bold
 * @property {string} underline - underlines text
 * @property {string} red - changes the color to red
 * @property {string} green - changes the color to green
 * @property {string} yellow - changes color to yellow
 * @property {string} cyan - changes color to cyan
 * @example
 * const colors = require('./colors')
 * console.log(`${colors.red}Error:${colors.reset} cannot find user`);
 */

const COLORS = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  underline: "\x1b[4m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan:"\x1b[36m"
};

module.exports = COLORS
