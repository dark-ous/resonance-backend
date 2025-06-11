import chalk from "chalk";

const log = {
  info: (msg, data = "") =>
    console.log(chalk.blue("ℹ️  INFO:"), chalk.white(msg), data),
  success: (msg, data = "") =>
    console.log(chalk.green("✅ SUCCESS:"), chalk.white(msg), data),
  error: (msg, data = "") =>
    console.error(chalk.red("❌ ERROR:"), chalk.white(msg), data),
  warn: (msg, data = "") =>
    console.warn(chalk.yellow("⚠️  WARNING:"), chalk.white(msg), data),
};

export default log;
