// commands.rs

use serde::{Deserialize, Serialize};
use std::fs::{self, read_to_string, File};
use std::io::Write;
use std::path::PathBuf;
use tauri::{command, AppHandle, Manager};
use chrono::{DateTime, Utc};
use uuid::Uuid;

// 定义配置结构体
#[derive(Serialize, Deserialize)]
pub struct Config {
    pub general: GeneralConfig,
    pub chatglm: AiServiceConfig,
    pub deepseek: AiServiceConfig,
    pub qwen: AiServiceConfig,
}

// 定义通用设置结构体
#[derive(Serialize, Deserialize)]
pub struct GeneralConfig {
    pub theme_color: String,
    pub username: String,
}

// 定义 AI 服务配置结构体
#[derive(Serialize, Deserialize)]
pub struct AiServiceConfig {
    pub api_url: String,
    pub api_key: String,
}


// 定义对话结构体
#[derive(Debug, Serialize, Deserialize)]
pub struct Conversation {
    conversation_id: Uuid,
    start_time: DateTime<Utc>,
    end_time: DateTime<Utc>,
    title: String,
    messages: Vec<Message>,
}

// 定义消息结构体
#[derive(Debug, Serialize, Deserialize)]
struct Message {
    timestamp: DateTime<Utc>,
    sender: Sender,
    content: String,
}

// 定义发送者信息结构体
#[derive(Debug, Serialize, Deserialize)]
struct Sender {
    role: String,
    name: String,
}


// 确保应用（配置/数据）目录存在
fn ensure_app_dir_exists(dir_path: &PathBuf) -> Result<(), String> {
    if !dir_path.exists() {
        fs::create_dir_all(dir_path).map_err(|e| e.to_string())?;
    }
    Ok(())
}

// 读取配置文件
#[command]
pub async fn read_config(app: AppHandle) -> Result<Config, String> {
    let config_path = app.path().app_config_dir().map_err(|e| e.to_string())?;
    ensure_app_dir_exists(&config_path)?; // 检查配置目录是否存在
    let config_file_path = config_path.join("config.json");

    // 打印路径以检查
    println!("Reading config from: {:?}", config_file_path);

    match read_to_string(config_file_path) {
        Ok(content) => match serde_json::from_str(&content) {
            Ok(config) => Ok(config),
            Err(e) => Err(format!("Failed to parse config: {}", e)),
        },
        Err(e) => Err(format!("Failed to read config file: {}", e)),
    }
}

// 保存配置文件
#[command]
pub async fn save_config(app: AppHandle, config: Config) -> Result<(), String> {
    let config_path = app.path().app_config_dir().map_err(|e| e.to_string())?;
    ensure_app_dir_exists(&config_path)?;
    let config_file_path = config_path.join("config.json");

    // 打印路径以检查
    println!("Saving config to: {:?}", config_file_path);

    let serialized_config = serde_json::to_string(&config).map_err(|e| e.to_string())?;

    match File::create(config_file_path) {
        Ok(mut file) => {
            file.write_all(serialized_config.as_bytes())
                .map_err(|e| e.to_string())?;
            Ok(())
        }
        Err(e) => Err(format!("Failed to create config file: {}", e)),
    }
}

// 生成UUID
#[command]
pub async fn generate_uuid() -> String {
    Uuid::new_v4().to_string()
}

// 读取对话
#[command]
pub async fn read_conversation(
    app: AppHandle,
    conversation_id: String,
) -> Result<Conversation, String> {
    let data_path = app.path().app_data_dir().map_err(|e| e.to_string())?;
    ensure_app_dir_exists(&data_path)?;
    let conv_dir = data_path.join("conversations");
    ensure_app_dir_exists(&conv_dir)?;
    let conv_file_name = format!("conv_{}.json", conversation_id);
    let conv_file_path = conv_dir.join(conv_file_name);

    // 打印路径以检查
    println!("Reading conversation from: {:?}", conv_file_path);

    match read_to_string(conv_file_path) {
        Ok(content) => match serde_json::from_str(&content) {
            Ok(conversation) => Ok(conversation),
            Err(e) => Err(format!("Failed to parse conversation: {}", e)),
        },
        Err(e) => Err(format!("Failed to read config file: {}", e)),
    }
}

// 保存对话
#[command]
pub async fn save_conversation(
    app: AppHandle,
    conversation_id: String,
    conversation: Conversation,
) -> Result<(), String> {
    let data_path = app.path().app_data_dir().map_err(|e| e.to_string())?;
    ensure_app_dir_exists(&data_path)?;
    let conv_dir = data_path.join("conversations");
    ensure_app_dir_exists(&conv_dir)?;
    let conv_file_name = format!("conv_{}.json", conversation_id);
    let conv_file_path = conv_dir.join(conv_file_name);

    // 打印路径以检查
    println!("Saving conversation to: {:?}", conv_file_path);

    // serde
    let serialized_conv = serde_json::to_string(&conversation).map_err(|e| e.to_string())?;

    // 创建文件并写入对话数据
    match File::create(conv_file_path) {
        Ok(mut file) => {
            file.write_all(serialized_conv.as_bytes())
                .map_err(|e| e.to_string())?;
            Ok(())
        }
        Err(e) => Err(format!("Failed to create conversation file: {}", e)),
    }
}

// 删除对话
#[command]
pub async fn delete_conversation(
    app: AppHandle,
    conversation_id: String,
) -> Result<(), String> {
    let data_path = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let conv_dir = data_path.join("conversations");
    if !conv_dir.exists() {
        return Err("Conversation directory does not exist.".to_string());
    }

    let conv_file_name = format!("conv_{}.json", conversation_id);
    let conv_file_path = conv_dir.join(conv_file_name);

    // 打印路径以检查
    println!("Deleting conversation file: {:?}", conv_file_path);

    if conv_file_path.exists() {
        match fs::remove_file(conv_file_path) {
            Ok(_) => Ok(()),
            Err(e) => Err(format!("Failed to delete conversation file: {}", e)),
        }
    } else {
        Err("Conversation file does not exist.".to_string())
    }
}