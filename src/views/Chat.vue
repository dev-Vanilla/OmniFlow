<script setup>
import { ref, inject, nextTick, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import MarkdownIt from 'markdown-it';


// 初始化路由
const router = useRouter();

// 注入配置
const config = inject('config');
const readConfig = inject('readConfig');

// 用户名
const userName = config.value.general.username;

// 注入对话
const isFakeNewConv = inject('isFakeNewConv');
const conversation = inject('conversation');
const readConversation = inject('readConversation');
const saveConversation = inject('saveConversation');
const deleteConversationFile = inject('deleteConversationFile');
const newConversation = inject('newConversation');

// 注入对话索引
const conversationIndex = inject('conversationIndex');
const updateConversationIndex = inject('updateConversationIndex');
const deleteConversationIndex = inject('deleteConversationIndex');
const loadConversationIndex = inject('loadConversationIndex');
const saveConversationIndex = inject('saveConversationIndex');

// TODO: 记得先保存当前对话！
async function fakeNewConversation() {
    isFakeNewConv.value = true;
    conversation.value = {
        conversation_id: null,
        start_time: null,
        end_time: null,
        title: null,
        messages: []
    };
    messages.value = [];
}

// TODO: unmounted
async function realNewConv() {
    isFakeNewConv.value = false;
    await newConversation();
    conversation.value.title = inputMessage.value;
    conversation.value.start_time = new Date().toISOString();
    conversation.value.end_time = new Date().toISOString();
    await sendMessage();
    saveConversation();
    updateConversationIndex(conversation.value);
    saveConversationIndex();
}

// 模型名称
const modelCode = ref('glm-4-flash');
const selectedModel = ref();
const models = ref([
    {
        name: 'ChatGLM',
        modelType: [
            {
                name: 'GLM-4',
                modelName: [
                    { mname: 'GLM-4-Plus', code: 'glm-4-plus' },
                    { mname: 'GLM-4-Air', code: 'glm-4-air' },
                    { mname: 'GLM-4-Air-0111', code: 'glm-4-air-0111' },
                    { mname: 'GLM-4-AirX', code: 'glm-4-airx' },
                    { mname: 'GLM-4-Long', code: 'glm-4-long' },
                    { mname: 'GLM-4-FlashX', code: 'glm-4-flashx' },
                    { mname: 'GLM-4-Flash', code: 'glm-4-flash' }
                ]
            },
            // TODO: 多模态
            // {
            //     name: 'GLM-4V',
            //     modelName: [
            //         { mname: 'GLM-4V-Plus-0111', code: 'glm-4v-plus-0111' },
            //         { mname: 'GLM-4V-Plus', code: 'glm-4v-plus' },
            //         { mname: 'GLM-4V', code: 'glm-4v' },
            //         { mname: 'GLM-4V-Flash', code: 'glm-4v-flash' }
            //     ]
            // },
            {
                name: 'GLM-Zero',
                modelName: [
                    { mname: 'GLM-Zero-Preview', code: 'glm-zero-preview' }
                ]
            },

        ]
    },
    {
        name: 'DeepSeek',
        modelType: [
            {
                name: 'DeepSeek Chat',
                modelName: [
                    { mname: 'DeepSeek-V3', code: 'deepseek-chat' }
                ]
            },

            {
                name: 'DeepSeek Reasoner',
                modelName: [
                    { mname: 'DeepSeek-R1', code: 'deepseek-reasoner' }
                ]
            }
        ]
    },
    {
        name: 'Qwen',
        modelType: [
            {
                name: 'Qwen',
                modelName: [
                    { mname: 'Qwen-Max', code: 'qwen-max' },
                    { mname: 'Qwen-Max-Latest', code: 'qwen-max-latest' },
                    { mname: 'Qwen2.5-Max', code: 'qwen-max-0125' },
                    { mname: 'Qwen-Plus', code: 'qwen-plus' },
                    { mname: 'Qwen-Plus-Latest', code: 'qwen-plus-latest' },
                    { mname: 'Qwen-Turbo', code: 'qwen-turbo' },
                    { mname: 'Qwen-Turbo-Latest', code: 'qwen-turbo-latest' },
                    { mname: 'Qwen-Long', code: 'qwen-long' },
                    { mname: 'Qwen-Omni-Turbo', code: 'qwen-omni-turbo' },
                    { mname: 'Qwen-Omni-Turbo-Latest', code: 'qwen-omni-turbo-latest' }
                ]
            },
            {
                name: 'Open Source',
                modelName: [
                    { mname: 'QWQ-32b', code: 'qwq-32b-preview' },
                    { mname: 'Qwen-14b-Instruct-1m', code: 'qwen2.5-14b-instruct-1m' },
                    { mname: 'Qwen-7b-Instruct-1m', code: 'qwen2.5-7b-instruct-1m' },
                    { mname: 'Qwen2.5-72b-Instruct', code: 'qwen2.5-72b-instruct' },
                    { mname: 'Qwen2.5-14b-Instruct', code: 'qwen2.5-14b-instruct' },
                    { mname: 'Qwen2.5-7b-Instruct', code: 'qwen2.5-7b-instruct' },
                    { mname: 'Qwen2.5-1.5b-Instruct', code: 'qwen2.5-1.5b-instruct' },
                    { mname: 'Qwen2.5-0.5b-Instruct', code: 'qwen2.5-0.5b-instruct' }
                ]
            },
            {
                name: 'Other Models',
                modelName: [
                    { mname: 'Qwen-Math-Plus', code: 'qwen-math-plus' },
                    { mname: 'Qwen-Math-Plus-Latest', code: 'qwen-math-plus-latest' },
                    { mname: 'Qwen-Math-Turbo', code: 'qwen-math-turbo' },
                    { mname: 'Qwen-Math-Turbo-Latest', code: 'qwen-math-turbo-latest' },
                    { mname: 'Qwen-Coder-Plus', code: 'qwen-coder-plus' },
                    { mname: 'Qwen-Coder-Plus-Latest', code: 'qwen-coder-plus-latest' }, // 即qwen-max-0125
                    { mname: 'Qwen-Coder-Turbo', code: 'qwen-coder-turbo' },
                    { mname: 'Qwen-Coder-Turbo-Latest', code: 'qwen-coder-turbo-latest' },
                    { mname: 'Qwen-MT-Plus', code: 'qwen-mt-plus' },
                    { mname: 'Qwen-MT-Turbo', code: 'qwen-mt-turbo' }
                ]
            }

        ]
    }
]);

// 更新模型编码
const handleModelChange = (event) => {
    if (event.value && event.value.mname && event.value.code) {
        modelCode.value = event.value.code;

        const findParentModelName = (models, targetCode) => {
            for (const model of models) {
                for (const type of model.modelType) {
                    const found = type.modelName.find(item => item.code === targetCode);
                    if (found) {
                        return model.name;
                    }
                }
            }
            return null;
        };

        const parentModelName = findParentModelName(models.value, event.value.code);

        switch (parentModelName) {
            case 'Qwen':
                apiurl.value = config.value.qwen.api_url;
                break;
            case 'DeepSeek':
                apiurl.value = config.value.deepseek.api_url;
                break;
            case 'ChatGLM':
                apiurl.value = config.value.chatglm.api_url;
                break;
            default:
                apiurl.value = config.value.chatglm.api_url;
                break;
        }
    }
};

// apiUrl
const apiurl = ref(config.value.chatglm.api_url);

// 初始化 markdown-it
const md = new MarkdownIt({
    html: true, // 允许解析 HTML 标签
    linkify: true, // 自动将 URL 转换为链接
    typographer: true, // 启用排版优化
});

// 封装 Markdown 渲染函数
function renderMarkdown(content) {
    if (!content) return ''; // 如果内容为空，返回空字符串
    const rawHtml = md.render(content); // 使用 markdown-it 转换 Markdown
    return rawHtml;
}

// 控制菜单栏是否可见
const isMenuVisible = ref(true);
const toggleMenu = () => {
    isMenuVisible.value = !isMenuVisible.value;
};

// 右下角的弹出菜单
const moreMenu = ref();
const moreMenuItems = ref([
    {
        label: 'More',
        items: [
            {
                label: 'Config',
                icon: 'pi pi-sliders-h',
                command: () => {
                    router.push('/settings');
                }
            },
            // FIXME: Delete Test Page
            // {
            //     label: 'Test',
            //     icon: 'pi pi-upload',
            //     command: () => {
            //         router.push('/test');
            //     }
            // }
        ]
    }
]);
const toggleMoreMenu = (event) => {
    moreMenu.value.toggle(event);
};

// 是否启用web_search
const webSearch = true;

// 控制skeleton
const isLLMLoading = ref(false);

// 消息列表
const messages = ref(conversation.value.messages);

// 加载过去的对话
async function loadConversation(uuid) {
    await readConversation(uuid);
    isFakeNewConv.value = false;
    // 更新 messages ref
    messages.value = conversation.value.messages;
}

// 删除对话
async function deleteConversation(uuid) {
    await deleteConversationIndex(uuid);
    await deleteConversationFile(uuid);
    if (conversation.value.conversation_id == uuid) {
        await fakeNewConversation();
        // 更新 messages ref
        messages.value = conversation.value.messages;
    }
}


// 用户输入的消息
const inputMessage = ref('');

// 发送消息函数
async function sendMessage() {
    if (inputMessage.value.trim() !== '') {
        messages.value.push({
            timestamp: new Date().toISOString(),
            sender: {
                role: 'user',
                name: userName,
            },
            content: inputMessage.value
        });
        conversation.value.messages = messages.value;
        inputMessage.value = ''; // 清空输入框

        isLLMLoading.value = true;

        // 滚动到底部
        nextTick(() => {
            const chatMessages = document.querySelector('.chat-messages');
            if (chatMessages) {
                const lastMessage = chatMessages.lastElementChild;
                if (lastMessage) {
                    lastMessage.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
        saveConversation(); // 每新增一条消息，保存对话
        updateConversationIndex(conversation.value);
        saveConversationIndex();
        await callLLMModel(); // 调用GLM-4模型获取回应
    }
}

// 调用GLM-4模型的函数
async function callLLMModel() {
    try {
        // 构建请求消息
        const requestMessages = messages.value.map(msg => ({
            role: msg.sender.role,
            content: msg.content
        }));
        // 发送请求到GLM-4模型API
        const response = await axios.post(apiurl.value, {
            // 请替换为实际的API URL和请求参数
            model: modelCode.value, // 模型名称
            messages: requestMessages,
            tools: [
                {
                    type: 'web_search',
                    web_search: {
                        enable: webSearch  // 启用网络搜索
                    }
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.value.chatglm.api_key}` // API密钥
            }
        }
        );

        // 将模型的回应添加到消息列表
        messages.value.push({
            timestamp: new Date().toISOString(),
            sender: {
                role: 'assistant',
                name: modelCode,
            },
            content: response.data.choices[0].message.content
        });

        saveConversation(); // 每新增一条消息，保存对话
        updateConversationIndex(conversation.value);
        saveConversationIndex();

        isLLMLoading.value = false

        // 确保滚动到底部
        nextTick(() => {
            const chatMessages = document.querySelector('.chat-messages');
            if (chatMessages) {
                const lastMessage = chatMessages.lastElementChild;
                if (lastMessage) {
                    lastMessage.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });

    } catch (error) {
        console.error('Error calling GLM-4 model:', error); // 处理错误情况，例如显示错误消息
        snackbar = document.querySelector(".alert").open = true; // TODO：snackbar?
    }
}

onMounted(() => {
    readConfig();
    loadConversationIndex();
});
</script>

<template>
    <div class="flex h-screen">

        <!--侧边栏显隐按钮-->
        <Button icon=" pi pi-bars" severity="secondary" variant="text" rounded
            class="!absolute z-50 !transition-all duration-350 ease-in-out" :class="{
                'left-54 top-1': isMenuVisible,
                'left-4 top-1': !isMenuVisible
            }" @click="toggleMenu" />

        <!-- 左侧菜单栏 -->
        <transition enter-active-class="transition ease-in-out duration-350"
            enter-from-class="transform -translate-x-full" enter-to-class="transform translate-x-0"
            leave-active-class="transition ease-in-out duration-371" leave-from-class="transform translate-x-0"
            leave-to-class="transform -translate-x-full">

            <aside v-if="isMenuVisible" class="w-64 h-screen flex flex-col overflow-hidden">
                <!--菜单栏开头-->
                <div class="sticky top-0">
                    <span class="inline-flex items-center gap-1 px-2 py-2 ml-2">
                        <Avatar image="/src-tauri/icons/icon.png" shape="circle" />
                        <span class="text-xl font-semibold ml-2">Omni<span class="text-primary">Flow</span></span>
                    </span>
                    <Button @click="fakeNewConversation" severity="secondary" class="w-60 mx-2">开始新对话</Button>
                </div>

                <!--中间可滚动区域-->
                <div class="flex-1  overflow-y-auto p-1">
                    <div v-if="isFakeNewConv"
                        class="w-62 h-10 flex items-center justify-left rounded-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">
                        <p>新对话</p>
                    </div>
                    <div v-for="(conversation, id) in conversationIndex" :key="id"
                        class="group flex relative justify-between items-center rounded-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">
                        <p @click="loadConversation(id)" class="flex-grow text-left">{{ conversation.title }}</p>
                        <Button @click="deleteConversation(id)" severity="secondary" variant="text" size="small"
                            icon="pi pi-times" rounded
                            class="absolute right-2 opacity-0 group-hover:opacity-100 items-center justify-center" />
                    </div>
                </div>

                <!--菜单栏底部-->
                <div class="sticky bottom-0 p-2">
                    <Button icon="pi pi-ellipsis-v" severity="secondary" size="small" variant="text"
                        @click="toggleMoreMenu" aria-haspopup="true" aria-controls="overlay_menu" />
                    <Menu ref="moreMenu" id="overlay_menu" :model="moreMenuItems" :popup="true" />
                </div>

            </aside>
        </transition>

        <!-- 右侧内容区域 -->
        <main :class="{ 'ml-64 ': isMenuVisible, 'ml-0': !isMenuVisible }"
            :style="{ width: isMenuVisible ? 'calc(100vw - var(--spacing) * 64)' : '100%' }"
            class="absolute overflow-y-auto h-screen transition-all duration-350 ease-in-out">

            <!-- 对话内容显示区域 -->
            <div class="chat-messages h-screen px-4 space-y-4 overflow-y-auto">
                <!-- 顶部操作栏 -->
                <span :class="{ 'ml-0 ': isMenuVisible, 'ml-8': !isMenuVisible }"
                    class="sticky top-0 inline-flex items-center gap-1 px-2 py-1 z-50 transition-all duration-350 ease-in-out">
                    <!--TODO: 模型选择器-->
                    <CascadeSelect v-model="selectedModel" @change="handleModelChange" variant="filled"
                        :options="models" optionLabel="mname" optionGroupLabel="name"
                        :optionGroupChildren="['modelType', 'modelName']" class="w-48" placeholder="Select a Model" />
                    <!--FIXME: 测试用，记得删去-->
                    <!-- <p v-text="modelCode"></p> -->
                    <!-- <p v-text="apiurl"></p> -->
                    
                    <span class="ml-4 mr-2 font-medium">Web Search</span>
                    <ToggleSwitch v-model="webSearch" />
                </span>

                <!--顶部渐变条-->
                <div class="fixed top-0 h-24 custom-header"
                    :style="{ width: isMenuVisible ? 'calc(100vw - var(--spacing) * 64)' : '100%' }"></div>

                <div v-if="!isFakeNewConv" v-for="message in messages">
                    <!-- 用户消息 -->
                    <div v-if="message.sender.role === 'user'" class="flex justify-end">
                        <div v-text="message.content" class=" bg-amber-100 text-gray-800 p-3 rounded-lg max-w-[70%]">
                        </div>
                    </div>
                    <!-- AI 助手消息 -->
                    <Panel toggleable v-else-if="message.sender.role === 'assistant'" class="w-fit">
                        <template #header>
                            <div class="flex items-center gap-2">
                                <!-- TODO: LLMs' Avatars -->
                                <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                                    shape="circle" />
                                <span class="font-bold">GLM-4-Flash</span>
                            </div>
                        </template>
                        <div v-html="renderMarkdown(message.content)"
                            class="prose md:prose-md lg:prose-lg dark:prose-invert">
                        </div>
                    </Panel>
                </div>
                <!--TODO: 欢迎界面-->
                <div v-else>
                    <p class="text-xl font-bold">Welcome, {{ config?.general?.username || 'Guest' }}</p>
                </div>

                <div v-if="isLLMLoading" class="max-w-182">
                    <div class="flex justify-between mt-4">
                        <div class="flex mb-4">
                            <Skeleton shape="circle" size="2.5rem" class="ml-4 mr-2"></Skeleton>
                            <Skeleton width="8rem" height="1.5rem" class="mb-2 mt-1"></Skeleton>
                        </div>
                        <Skeleton width="2rem" class="mt-2 mr-6"></Skeleton>
                    </div>
                    <div class="flex mb-2 gap-2">
                        <Skeleton width="10rem"></Skeleton>
                        <Skeleton></Skeleton>
                    </div>
                    <div class="flex mb-2 gap-2">
                        <Skeleton width="40rem"></Skeleton>
                        <Skeleton></Skeleton>
                    </div>
                    <div class="flex mb-2 gap-2">
                        <Skeleton width="30rem"></Skeleton>
                        <Skeleton width="30rem"></Skeleton>
                        <Skeleton></Skeleton>
                    </div>
                    <Skeleton width="20rem" class="mb-2"></Skeleton>
                    <Skeleton height="2rem" class="mb-2"></Skeleton>
                    <div class="flex justify-between mt-2">
                        <Skeleton width="4rem" height="2rem"></Skeleton>
                        <Skeleton width="4rem" height="2rem"></Skeleton>
                    </div>
                </div>
                <!-- 防挡条 -->
                <div class="h-16"></div>
            </div>

            <!-- 底部悬浮工具栏 -->
            <div :class="{ 'left-74 ': isMenuVisible, 'left-10': !isMenuVisible }"
                class="fixed bottom-4 right-10 rounded-3xl p-2 z-50 shadow-md flex items-center gap-2 transition-all duration-350 ease-in-out">
                <InputText @keydown.enter="isFakeNewConv ? realNewConv() : sendMessage()" :value="inputMessage"
                    @input="inputMessage = $event.target.value" placeholder="Username"
                    class="flex-1 p-2 border border-gray-300 rounded" />
                <Button icon="pi pi-send" @click="isFakeNewConv ? realNewConv() : sendMessage()" rounded class="p-2" />
            </div>

            <!--底部渐变条-->
            <div class="fixed bottom-0 h-32 custom-footer"
                :style="{ width: isMenuVisible ? 'calc(100vw - var(--spacing) * 64)' : '100%' }"></div>

        </main>
    </div>
</template>

<style scoped>
/* 自定义顶栏样式 */

.custom-header {
    background-image: linear-gradient(to bottom,
            rgb(255, 255, 255),
            /* 上方透明度较高 */
            rgba(0, 0, 0, 0)
            /* 下方透明度较低 */
        );
}

.custom-footer {
    background-image: linear-gradient(to top,
            rgb(255, 255, 255),
            /* 上方透明度较高 */
            rgba(0, 0, 0, 0)
            /* 下方透明度较低 */
        );
}

@media (prefers-color-scheme: dark) {
    .custom-header {
        background-image: linear-gradient(to bottom,
                rgb(30, 30, 30, 1.0),
                /* 上方透明度较高 */
                rgba(0, 0, 0, 0)
                /* 下方透明度较低 */
            );
    }

    .custom-footer {
        background-image: linear-gradient(to top,
                rgb(30, 30, 30, 1.0),
                /* 上方透明度较高 */
                rgba(0, 0, 0, 0)
                /* 下方透明度较低 */
            );
    }
}
</style>