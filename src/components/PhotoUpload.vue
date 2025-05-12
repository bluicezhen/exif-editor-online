<script setup lang="ts">
import { ref } from 'vue'
import { ElUpload, ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const imageUrl = ref<string>('')

function handleUploadSuccess(_response: any, file: any) {
  imageUrl.value = URL.createObjectURL(file.raw)
}

function beforeUpload(file: any) {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
  }
  return isImage
}
</script>

<template>
  <div class="photo-upload-container h-full w-full">
    <div v-if="!imageUrl" class="upload-placeholder flex flex-col items-center justify-center h-full">
      <el-upload
        class="upload-area"
        drag
        action="#"
        :auto-upload="false"
        :show-file-list="false"
        :on-success="handleUploadSuccess"
        :before-upload="beforeUpload"
      >
        <el-icon class="text-5xl mb-4"><UploadFilled /></el-icon>
        <div class="text-gray-500">{{ t('upload.placeholder') }}</div>
      </el-upload>
    </div>
    <div v-else class="image-preview h-full">
      <img :src="imageUrl" class="w-full h-full object-contain" />
    </div>
  </div>
</template>

<style scoped>
.photo-upload-container {
  background-color: #f8f8f8;
  border-radius: 4px;
}

.upload-placeholder {
  border: 2px dashed #dcdfe6;
  border-radius: 4px;
}
</style> 