<!-- GeneralSettings.vue -->
<template>
    <div>
        <span class="text-2xl font-bold">General</span>
        <!-- Your general settings form or content here -->

        <div class="card flex flex-col gap-4 my-2">
            <!--TODO: 阴阳模式选择-->
            <div class="flex items-center justify-between">
                <label for="themeColor" class="font-semibold">Theme Color:(TODO)</label>
                <div class="flex flex-wrap gap-4">
                    <div class="flex items-center gap-2">
                        <RadioButton v-model="config.general.theme_color" value="System" />
                        <label>System</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <RadioButton v-model="config.general.theme_color" value="Light" />
                        <label>Light</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <RadioButton v-model="config.general.theme_color" value="Dark" />
                        <label>Dark</label>
                    </div>
                </div>
            </div>

            <!-- 用户名输入 -->
            <div class="flex items-center justify-between">
                <label for="username" class="font-semibold">Username:</label>
                <InputText name="username" type="text" v-model="config.general.username" placeholder="Username" />
            </div>
        </div>


    </div>
</template>

<script setup>
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