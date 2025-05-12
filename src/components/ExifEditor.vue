<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="exif-editor-container h-full w-full p-4">
    <div class="editor-placeholder flex items-center justify-center h-full">
      <p class="text-gray-500">{{ t('editor.title') }}</p>
    </div>
  </div>
</template>

<style scoped>
.exif-editor-container {
  background-color: #f5f5f5;
  border-left: 1px solid #e0e0e0;
}

.editor-placeholder {
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
}
</style> 