module.exports = {
    content: [
        './src/**/*.{vue,js,ts,jsx,tsx}', // 扫描 src 目录下的所有 Vue 和 JS/TS 文件
        './index.html', // 如果有 HTML 文件也需要扫描
    ],
    variants: {
        extend: {
            display: ['group-hover'], // 实现对话界面的悬浮显示
        },
    },
    theme: {
        extend: {}, // 在这里扩展或覆盖默认主题
    },
    plugins: [
        require('@tailwindcss/typography'), // 启用 typography 插件
        require('tailwindcss-primeui')
    ], // 启用插件
    corePlugins: {
        backdropBlur: true,
        backdropFilter: true,
      }, // 启用模糊
};