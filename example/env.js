// fetchEnv.js
const fs = require('fs');
const readline = require('readline');

const axios = require('axios');
class InputHandler {
  /**
   * Prompts the user for normal, visible input.
   * @param {string} promptMessage The message to display to the user.
   * @returns {Promise<string>} A promise that resolves with the user's input.
   */
  static async getNormalInput(promptMessage) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question(promptMessage, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }

  /**
   * Prompts the user for secret, masked input (e.g., a password).
   * Requires the 'read-console-input' package.
   * @param {string} promptMessage The message to display to the user.
   * @returns {Promise<string>} A promise that resolves with the user's secret input.
   */
  static async getSecretInput(promptMessage) {
    return new Promise((resolve) => {

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      // Hide input by muting output
      const stdin = process.stdin;
      const onDataHandler = (char) => {
        char = char + "";
        switch (char) {
          case "\n":
          case "\r":
          case "\u0004":
            stdin.pause();
            break;
          default:
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(promptMessage + "*".repeat(rl.line.length));
            break;
        }
      };

      process.stdout.write(promptMessage);
      stdin.on("data", onDataHandler);

      rl.question("", (answer) => {
        stdin.removeListener("data", onDataHandler);
        process.stdout.write("\n");
        rl.close();
        resolve(answer);
      });
    });
  }
}

(async () => {
  const apiKey = await InputHandler.getSecretInput('Enter your API key: ');

  try {
    const response = await axios.post(`http://nafish.me:4060/api/v1/rest/secrets/T5fhTOufD7HHXtHRRr7VkenNrRNmyQ6N`, {}, {
      headers: {
        'x-api-key': apiKey,
      }
    });

    const json = response.data;
    if (!json.result) {
      console.error('Error: No "result" in response.');
      process.exit(1);
    }

    const envLines = Object.entries(json.result)
      .map(([key, value]) => `export ${key}=${value}`)
      .join('\n');

    fs.writeFileSync('/tmp/env.sh', envLines);
    fs.chmodSync('/tmp/env.sh', 0o755);

    console.log('Saved env variables to /tmp/env.sh');
    console.log('Run: source /tmp/env.sh');
  } catch (e) {
    console.error('Failed to parse response:', e.message);
    console.log('Please check your API key and try again.');
    process.exit(1);
  }
})();
