// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn print_label(product_name: String, product_number: String) -> Result<String, String> {
    use std::io::Write;
    use std::process::{Command, Stdio};

    let epl = format!(
        "N\n\
         A20,20,0,4,1,1,N,\"{}\"\n\
         A20,60,0,4,1,1,N,\"{}\"\n\
         B20,100,0,1,2,4,80,B,\"{}\"\n\
         P1\n",
        product_name,
        product_number,
        product_number
    );

    let mut child = Command::new("lp")
        .args(["-d", "ZTC-LP-2824-Plus-EPL", "-o", "raw"])
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Could not start lp: {}", e))?;

    if let Some(stdin) = child.stdin.as_mut() {
        stdin
            .write_all(epl.as_bytes())
            .map_err(|e| format!("Could not send EPL to printer: {}", e))?;
    }

    let output = child
        .wait_with_output()
        .map_err(|e| format!("Printing failed: {}", e))?;

    if output.status.success() {
        Ok("Label sent to printer".to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_printer_v2::init())
        .invoke_handler(tauri::generate_handler![greet,print_label])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
