<script setup>
import 'primeicons/primeicons.css';
import { onMounted } from 'vue';
import { provideConfig } from './hooks/useConfig';
import { provideConversation } from './hooks/useConversation';
import { provideConversationStore } from './hooks/useConversationStore';

onMounted(() => {
  provideConfig();
  provideConversation();
  provideConversationStore();
});
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
@import "tailwindcss";
@plugin "@tailwindcss/typography";
</style>