<script setup lang="ts">
import { ElUpload, ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Define events
const emit = defineEmits<{
  (e: 'upload-image', file: { url: string, name: string, id: string }): void
}>()

function handleChange(file: any) {
  if (!file || !file.raw) return
  
  const isImage = file.raw.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('Only image files are allowed!')
    return
  }
  
  // Send uploaded image info to parent component
  emit('upload-image', {
    url: URL.createObjectURL(file.raw),
    name: file.raw.name,
    id: Date.now().toString(),
  })
}
</script>

<template>
  <div class="photo-upload-container">
    <div class="upload-placeholder">
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
  </div>
</template>

<style scoped>
/* Main container for the upload component */
.photo-upload-container {
  height: 100%;
  width: 100%;
  background-color: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Placeholder area with dashed border */
.upload-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #dcdfe6;
  border-radius: 4px;
  transition: border-color 0.3s;
}

/* Hover effect for placeholder */
.upload-placeholder:hover {
  border-color: #409eff;
}

/* Upload area takes full space of placeholder */
.upload-area {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Icon styling */
.upload-icon {
  font-size: 3rem;
  color: #909399;
  margin-bottom: 1rem;
}

/* Text styling */
.upload-text {
  color: #606266;
  font-size: 1rem;
}

/* Override for Element Plus upload component */
:deep(.el-upload-dragger) {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: transparent;
}
</style> 