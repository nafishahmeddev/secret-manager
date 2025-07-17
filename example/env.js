// fetchEnv.js
const fs = require('fs');
const readline = require('readline');
const https = require('https');
const http = require('http');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(query, silent = false) {
  return new Promise((resolve) => {
    if (!silent) return rl.question(query, resolve);
    process.stdout.write(query);
    process.stdin.setRawMode(true);
    let password = '';
    process.stdin.on('data', (char) => {
      char = char + '';
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          process.stdin.setRawMode(false);
          process.stdout.write('\n');
          process.stdin.removeAllListeners('data');
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        default:
          password += char;
          break;
      }
    });
  });
}

(async () => {
  const username = await ask('Enter your username: ');
  const password = await ask('Enter your password: ', true);

  rl.close();

  const data = JSON.stringify({ username, password });

  const options = {
    hostname: 'nafish.me',
    port: 4060,
    path: '/api/v1/rest/secrets/T5fhTOufD7HHXtHRRr7VkenNrRNmyQ6N',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'f082a3de7d918fd66c6c3c578d38a9cbce3d076bac30d8b65d7ff5d00c0359ef48de3a3ccedb6f2e4405e84f170db0714b7ff321e37fbae9848747e86a5b55c32155dcb3437805d0d496d572f5312319965d7b7487651c158d77e4e1f96b509d3ffa959a4aecca8ae7c3758f50e65f6d',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(body);
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
        process.exit(1);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Request error: ${e.message}`);
    process.exit(1);
  });

  req.write(data);
  req.end();
})();
