<template>
    <div class="relative">
        <!-- 顶栏 -->
        <div>For Test Use Only</div>
        <header class="fixed top-0 left-0 right-0 h-16 backdrop-blur-lg z-10 custom-header">
            <div class="flex items-center justify-center h-full text-lg font-bold text-gray-800">
                高斯模糊顶栏
            </div>
        </header>

        <!-- 滚动内容 -->
        <main class="pt-16">
            <div class="h-screen bg-gradient-to-b from-blue-200 to-purple-200">
                <p class="text-center text-2xl pt-10">滚动内容区域</p>
                <div class="mt-20 space-y-4">
                    <div v-for="(color, index) in colors" :key="index" :class="['h-20', color]"></div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
export default {
    name: "App",
    data() {
        return {
            // 定义滚动内容的颜色块
            colors: ["bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-red-400"],
        };
    },
};
</script>

<style scoped>
/* 自定义顶栏样式 */
.custom-header {
    background-image: linear-gradient(to bottom,
            rgba(255, 255, 255, 1.0),
            /* 上方透明度较高 */
            rgba(255, 255, 255, 0)
            /* 下方透明度较低 */
        );
}
</style>