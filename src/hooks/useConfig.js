// useConfig.js
import { ref, provide, onMounted } from 'vue';
import { invoke } from "@tauri-apps/api/core";

const config = ref({
    general: {
        theme_color: 'System',
        username: 'Guest',
    },
    chatglm: {
        api_url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        api_key: ''
    },
    deepseek: {
        api_url: 'https://api.deepseek.com/chat/completions',
        api_key: ''
    },
    qwen: {
        api_url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        api_key: ''
    }
});

const readConfig = async () => {
    try {
        const loadedConfig = await invoke('read_config');
        config.value = loadedConfig;
    } catch (error) {
        console.error('Failed to load settings:', error);
    }
};

const saveConfig = async (newConfig) => {
    try {
        await invoke('save_config', { config: config.value });
    } catch (error) {
        console.error('Failed to save settings:', error);
    }
};

// 封装配置相关函数
export function provideConfig() {
    provide('config', config);
    provide('readConfig', readConfig);
    provide('saveConfig', saveConfig);
}
