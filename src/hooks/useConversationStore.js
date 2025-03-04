// useConversationStore.js
import { ref, provide } from 'vue';
import { openIndexedDB, saveToIndexedDB, getFromIndexedDB, deleteFromIndexedDB } from '../utils/indexedDB';

const conversationIndex = ref({});

const updateConversationIndex = (conversation) => {
    conversationIndex.value[conversation.conversation_id] = {
        title: conversation.title,
        start_time: conversation.start_time,
        end_time: conversation.end_time,
    };
};

// 删除对话记录
const deleteConversationIndex = async (conversationId) => {
    try {
        // 从 IndexedDB 中删除对话记录
        await deleteFromIndexedDB(conversationId);
        // 从 conversationIndex 中删除对话
        delete conversationIndex.value[conversationId];
        // 保存更新后的对话索引
        await saveConversationIndex();
    } catch (error) {
        console.error('Failed to delete conversation:', error);
    }
};

const loadConversationIndex = async () => {
    try {
        const index = await getFromIndexedDB('conversationIndex');
        if (index) {
            conversationIndex.value = index;
        }
    } catch (error) {
        console.error('Failed to load conversation index:', error);
    }
};

const saveConversationIndex = async () => {
    try {
        await saveToIndexedDB('conversationIndex', conversationIndex.value);
    } catch (error) {
        console.error('Failed to save conversation index:', error);
    }
};

const provideConversationStore = () => {
    provide('conversationIndex', conversationIndex);
    provide('updateConversationIndex', updateConversationIndex);
    provide('deleteConversationIndex', deleteConversationIndex);
    provide('loadConversationIndex', loadConversationIndex);
    provide('saveConversationIndex', saveConversationIndex);
};

export { provideConversationStore };
