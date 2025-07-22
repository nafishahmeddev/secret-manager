use std::io::{self, Write};
use std::process::Command;
use serde_json::Value;

#[tokio::main]
async fn main() {
    print!("Enter your API key: ");
    io::stdout().flush().unwrap();
    let api_key = rpassword::read_password().unwrap();

    let url = "https://secret.nafish.me/api/v1/rest/secrets/A0btZ4qMR4NUDYU6m5VOB6gV9QFdsQD1";
    let client = reqwest::Client::new();
    let res = client
        .post(url)
        .header("x-api-key", api_key.trim())
        .send()
        .await
        .unwrap_or_else(|_| panic!("HTTP request failed"));

    let body: Value = res.json().await.expect("Invalid JSON response");

    let result = body.get("result").expect("Missing 'result' in response");
    if !result.is_object() {
        eprintln!("Error: 'result' is not an object\n{}", body);
        std::process::exit(1);
    }

    for (k, v) in result.as_object().unwrap() {
        std::env::set_var(k, v.as_str().unwrap_or_default());
    }

    println!("Environment variables loaded into current process.");

    let status = Command::new("pm2")
        .arg("start")
        .arg("ecosystem.config.js")
        .status()
        .expect("Failed to run pm2");

    if !status.success() {
        eprintln!("pm2 failed with code: {}", status.code().unwrap_or(-1));
    }
}
