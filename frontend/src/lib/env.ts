
export default class EnvUtil {
  static parseEnvString(envString: string) {
    const env = {} as Record<string, string>;
    const lines = envString.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Skip empty lines and comments
      if (trimmedLine.length === 0 || trimmedLine.startsWith('#')) {
        continue;
      }

      // Find the first '='
      const equalsIndex = trimmedLine.indexOf('=');

      // If no '=' found, skip the line
      if (equalsIndex === -1) {
        continue;
      }

      const key = trimmedLine.substring(0, equalsIndex).trim();
      let value = trimmedLine.substring(equalsIndex + 1).trim();

      // Remove surrounding quotes from the value if present
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.substring(1, value.length - 1);
      }

      // Handle escaped characters (e.g., \n, \r, \t, \\, \", \') - basic implementation
      value = value
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\\\/g, '\\')
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'");

      env[key] = value;
    }
    return env;
  }
}