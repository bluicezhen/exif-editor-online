<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import PhotoUpload from './components/PhotoUpload.vue'
import ExifEditor from './components/ExifEditor.vue'

const { t } = useI18n()
</script>

<template>
  <div class="app-container">
    <!-- 顶部 Banner -->
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

    <!-- 主要内容区域 -->
    <main class="app-content w-full px-4 py-6 flex">
      <!-- 左侧照片显示区域 -->
      <div class="photo-area w-3/4 pr-4">
        <PhotoUpload />
      </div>

      <!-- 右侧 EXIF 编辑区域 -->
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
