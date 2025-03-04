import { createApp } from 'vue'; // 引入 Vue 的 createApp 方法
import App from './App.vue'; // 引入根组件 App.vue
import router from './router'; // 引入路由配置

import PrimeVue from 'primevue/config'; // 引入 PrimeVue 配置
import { definePreset } from '@primeuix/themes'; // 允许个性化
import Aura from '@primeuix/themes/aura'; // 引入 Aura 主题


// 创建 Vue 应用实例
const app = createApp(App);

app.use(router); // 注册路由

// customize theme
const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{amber.50}',
            100: '{amber.100}',
            200: '{amber.200}',
            300: '{amber.300}',
            400: '{amber.400}',
            500: '{amber.500}',
            600: '{amber.600}',
            700: '{amber.700}',
            800: '{amber.800}',
            900: '{amber.900}',
            950: '{amber.950}'
        }
    }
});

// 使用 PrimeVue 插件 与 Aura 主题
app.use(PrimeVue, {
    theme: {
        preset: MyPreset
    }
});

// 将应用挂载到 DOM 中的 #app 元素
app.mount('#app');
