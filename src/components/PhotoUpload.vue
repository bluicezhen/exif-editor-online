<script setup lang="ts">
import { ElUpload, ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Define events
const emit = defineEmits<{
  (e: 'upload-image', file: { url: string, name: string, id: string }): void
}>()

// Maximum image file size in MB
const MAX_FILE_SIZE = 10

// Handle file change event when user selects a file
function handleChange(file: any) {
  if (!file || !file.raw) return
  
  // Validate file is an image
  const isImage = file.raw.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error(t('upload.onlyImages'))
    return
  }
  
  // Check file size (max 10MB)
  if (file.raw.size > MAX_FILE_SIZE * 1024 * 1024) {
    ElMessage.error(t('upload.sizeExceeded', { size: MAX_FILE_SIZE }))
    return
  }
  
  // Send uploaded image info to parent component (keeping original image)
  emit('upload-image', {
    url: URL.createObjectURL(file.raw),
    name: file.raw.name,
    id: Date.now().toString(),
  })
}
</script>

<template>
  <div class="photo-upload-container">
    <el-upload
      class="upload-area"
      drag
      action="#"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleChange"
    >
      <el-icon class="upload-icon"><UploadFilled /></el-icon>
      <div class="upload-text">{{ t('upload.placeholder') }}</div>
    </el-upload>
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/styles/abstracts' as *;

.photo-upload-container {
  height: 100%;
  width: 100%;
  background-color: var(--bg-primary);
  border-radius: $border-radius;
  overflow: hidden;
}

.upload-area {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .upload-icon {
    font-size: 3rem;
    color: var(--text-secondary);
    margin-bottom: 1rem;
  }
  
  .upload-text {
    color: var(--text-secondary);
    font-size: 1rem;
  }
}

// Override Element Plus upload component styles
:deep(.el-upload-dragger) {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: 2px dashed var(--border-color);
  
  &:hover {
    border-color: var(--color-primary);
  }
}
</style> 