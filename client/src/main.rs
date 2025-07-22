use std::io::{self, Write};
use std::process::Command;
use serde_json::Value;

#[tokio::main]
async fn main() {
    // Prompt for API key
    print!("Enter your API key: ");
    io::stdout().flush().unwrap();

    // Parse command-line arguments for project key
    let args: Vec<String> = std::env::args().collect();
    let project_key = args.iter()
        .position(|arg| arg == "--key")
        .and_then(|i| args.get(i + 1))
        .cloned()
        .unwrap_or_else(|| {
            eprintln!("Usage: {} --key <PROJECT_KEY>", args[0]);
            std::process::exit(1);
        });

    // Read API key securely
    let api_key = rpassword::read_password().unwrap();

    // Make HTTP request to fetch secrets
    let url = format!("https://secret.nafish.me/api/v1/rest/secrets/{}", project_key);
    let client = reqwest::Client::new();
    let res = client
        .post(url)
        .header("x-api-key", api_key.trim())
        .send()
        .await
        .expect("HTTP request failed");

    let body: Value = res.json().await.expect("Invalid JSON response");

    // Extract and set environment variables
    let result = body.get("result").expect("Missing 'result' in response");
    let result_obj = result.as_object().expect("'result' is not an object");

    for (k, v) in result_obj {
        std::env::set_var(k, v.as_str().unwrap_or_default());
    }

    println!("Environment variables loaded into current process.");

    // Start pm2 process
    let status = Command::new("pm2")
        .arg("start")
        .arg("ecosystem.config.js")
        .status()
        .expect("Failed to run pm2");

    if !status.success() {
        eprintln!("pm2 failed with code: {}", status.code().unwrap_or(-1));
    }
}
