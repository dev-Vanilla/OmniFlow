<script setup>
import { ref, provide, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { invoke } from "@tauri-apps/api/core";
import GeneralSettings from '../components/GeneralSettings.vue';
import ChatGLMSettings from '../components/ChatGLMSettings.vue';
import DeepSeekSettings from '../components/DeepSeekSettings.vue';
import QwenSettings from '../components/QwenSettings.vue';
import AboutSetttings from '../components/AboutSetttings.vue';

const router = useRouter();

const currentComponent = ref(GeneralSettings);

const settingsMenuItems = ref([
    {
        label: 'Documents',
        items: [
            {
                label: 'General',
                icon: 'pi pi-cog',
                command: () => {
                    currentComponent.value = GeneralSettings
                }
            },
            {
                label: '界面外观(TODO)',
                icon: 'pi pi-objects-column'
            }
        ]
    },
    {
        label: 'Models',
        items: [
            {
                label: 'ChatGLM',
                icon: 'pi pi-comment',
                command: () => {
                    currentComponent.value = ChatGLMSettings
                }
            },
            {
                label: 'DeepSeek',
                icon: 'pi pi-search',
                command: () => {
                    currentComponent.value = DeepSeekSettings
                }
            },
            {
                label: 'Qwen',
                icon: 'pi pi-question',
                command: () => {
                    currentComponent.value = QwenSettings
                }
            }
        ]
    },
    {
        label: 'Profile',
        items: [
            {
                label: 'About',
                icon: 'pi pi-info-circle',
                command: () => {
                    currentComponent.value = AboutSetttings
                }
            }
            // TODO: Log Out
            // {
            //     label: 'Logout',
            //     icon: 'pi pi-sign-out'
            // }
        ]
    }
]);


</script>

<template>
    <div class="flex h-screen">
        <aside>
            <Menu :model="settingsMenuItems" class="w-64 h-screen flex flex-col overflow-hidden">
                <template #start>
                    <span class="inline-flex items-center gap-1 px-2 py-1">
                        <Button icon=" pi pi-arrow-left" severity="secondary" variant="text" rounded
                            @click="router.go(-1)" />
                        <span class="text-2xl">Settings</span>
                    </span>
                </template>
            </Menu>
        </aside>

        <main class="ml-64 py-2 px-4 absolute overflow-y-auto h-screen"
            style=" width: calc(100vw - var(--spacing) * 64) ">
            <component :is="currentComponent" />
        </main>

    </div>

</template>
