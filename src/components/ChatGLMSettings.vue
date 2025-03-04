<!-- ChatGLMSettings.vue -->
<template>
    <div>
        <span class="text-2xl font-bold">ChatGLM</span>

        <!-- ChatGLM 配置 -->
        <div class="card flex flex-col gap-4 my-2">
            <div>
                <label for="chatglmApiUrl" class="font-semibold">API URL:</label>
                <InputText type="text" id="chatglmApiUrl" v-model="config.chatglm.api_url" fluid />
            </div>

            <div>
                <label for="chatglmApiKey" class="font-semibold">API Key:</label>
                <Password v-model="config.chatglm.api_key" toggleMask :feedback="false" fluid />
            </div>
        </div>

    </div>
</template>

<script setup>
import { InputText } from 'primevue';
import { ref, provide, inject, onMounted, onUnmounted } from 'vue';

const config = inject('config');
const readConfig = inject('readConfig'); //TODO: readConfig 好像已经在Chat中搞定了（
const saveConfig = inject('saveConfig');

const saveConfigOnUnmount = () => {
    // 可以在这里添加任何额外的处理逻辑
    saveConfig(config.value); // 确保传递了正确的参数
};

onUnmounted(saveConfigOnUnmount);
</script>