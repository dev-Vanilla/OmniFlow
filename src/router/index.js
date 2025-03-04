// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// 导入页面组件
import Chat from '../views/Chat.vue';
import Settings from '../views/Settings.vue';
import Test from '../views/Test.vue';

// 定义路由
const routes = [
    {
        path: '/',
        redirect: '/chat'
    },
    {
        path: '/chat',
        name: 'Chat',
        component: Chat,
    },
    {
        path: '/settings',
        name: 'Settings',
        component: Settings,
    },
    {
        path: '/test',
        name: 'Test',
        component: Test,
    },
];

// 创建路由实例
const router = createRouter({
    history: createWebHistory(), // 使用 HTML5 History 模式
    routes,
});

export default router;