// useConversation.js
import { ref, provide, onMounted } from 'vue';
import { invoke } from "@tauri-apps/api/core";

const conversation = ref({
    conversation_id: null,
    start_time: null,
    end_time: null,
    title: null,
    messages: []
});

// 伪新对话
const isFakeNewConv = ref(true);

async function generateUUID() {
    const uuid = await invoke('generate_uuid');
    return uuid;
}

async function readConversation(uuid) {
    const conversationId = uuid;
    try {
        const loadedConversation = await invoke('read_conversation', { conversationId });
        // 若返回的 conversation 对象包含所需的对话数据
        if (loadedConversation) {
            conversation.value = loadedConversation;
        } else {
            console.error('Conversation not found');
        }
    } catch (error) {
        console.error('Error reading conversation:', error);
    }
}


async function saveConversation() {
    const conversationId = conversation.value.conversation_id;
    const messages = conversation.value.messages;
    conversation.value.end_time = messages[messages.length - 1].timestamp;
    await invoke('save_conversation', { conversationId, conversation: conversation.value });
}

async function deleteConversationFile(uuid) {
    try {
        await invoke('delete_conversation', { conversationId: uuid });
        // 删除成功后的操作，例如更新对话列表
    } catch (error) {
        // 处理错误
        console.error('Failed to delete conversation:', error);
    }
};

async function newConversation() {
    const uuid = await generateUUID();
    conversation.value.conversation_id = uuid;
}

export function provideConversation() {
    provide('isFakeNewConv', isFakeNewConv);
    provide('conversation', conversation);
    provide('readConversation', readConversation);
    provide('saveConversation', saveConversation);
    provide('deleteConversationFile', deleteConversationFile);
    provide('newConversation', newConversation);
}