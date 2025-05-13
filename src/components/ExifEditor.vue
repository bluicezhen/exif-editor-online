<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="exif-editor-container">
    <div class="editor-placeholder">
      <p class="placeholder-text">{{ t('editor.title') }}</p>
    </div>
  </div>
</template>

<style scoped>
/* EXIF Editor container takes full height and width of parent */
.exif-editor-container {
  height: 100%;
  width: 100%;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
}

/* Placeholder for editor content */
.editor-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: white;
}

/* Placeholder text style */
.placeholder-text {
  color: #909399;
  font-size: 1rem;
}
</style> 