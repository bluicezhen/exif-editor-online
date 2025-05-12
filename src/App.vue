<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { watchEffect } from 'vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import PhotoUpload from './components/PhotoUpload.vue'
import ExifEditor from './components/ExifEditor.vue'

const { t } = useI18n()

// 监听语言变化并更新网页标题
watchEffect(() => {
  document.title = t('title')
})
</script>

<template>
  <div class="app-container">
    <!-- Top Banner -->
    <header class="app-header bg-gray-800 text-white">
      <div class="w-full px-4 h-16 flex items-center justify-between">
        <h1 class="text-xl font-medium">{{ t('title') }}</h1>
        <div class="flex items-center gap-6">
          <LanguageSwitcher />
          <a 
            href="https://github.com/bluicezhen/exif-editor-online" 
            target="_blank" 
            class="text-gray-300 hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="app-content w-full px-4 py-6 flex">
      <!-- Left Photo Display Area -->
      <div class="photo-area w-3/4 pr-4">
        <PhotoUpload />
      </div>

      <!-- Right EXIF Editor Area -->
      <div class="exif-area w-1/4">
        <ExifEditor />
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
}

.app-content {
  flex: 1;
  height: calc(100vh - 4rem);
}

.photo-area, .exif-area {
  height: 100%;
}
</style>
