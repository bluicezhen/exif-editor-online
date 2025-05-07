<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDark, useToggle } from '@vueuse/core'
import { mergeExifData, formatExifValue, type ExifData } from './services/exifService'
import * as imageService from './services/imageService'
import { type IndexableExifData } from './services/imageService'

// Theme toggle
const isDark = useDark()
const toggleDark = useToggle(isDark)

// Internationalization
const { t, locale } = useI18n()

// Toggle language
const toggleLocale = () => {
  locale.value = locale.value === 'zh-CN' ? 'en' : 'zh-CN'
}

// Use service to get reactive data
const images = imageService.getImages()
const selectedImageIds = imageService.getSelectedImageIds()

// Merged EXIF data
const mergedExifData = ref<IndexableExifData>({})

// Editing EXIF data
const editingExifData = ref<IndexableExifData>({})

// Basic information display list
const basicExifKeys = ['FileName', 'FileSize', 'FileType', 'ImageWidth', 'ImageHeight', 'CreateDate', 'ModifyDate']

// Camera information display list
const cameraExifKeys = ['Make', 'Model', 'LensModel', 'FocalLength', 'FNumber', 'ExposureTime', 'ISO']

// Location information display list
const locationExifKeys = ['latitude', 'longitude', 'altitude', 'GPSImgDirection']

// Define editing component types
const editingComponentMap: Record<string, string> = {
  'FileName': 'text',
  'Make': 'text',
  'Model': 'text',
  'LensModel': 'text',
  'FocalLength': 'number',
  'FNumber': 'number',
  'ExposureTime': 'text',
  'ISO': 'number',
  'latitude': 'number',
  'longitude': 'number',
  'altitude': 'number',
  'GPSImgDirection': 'number'
}

// Handle image upload
const handleUpload = async (event: Event) => {
  const fileInput = event.target as HTMLInputElement
  if (fileInput.files) {
    await imageService.uploadImages(fileInput.files)
    // 清空文件输入，允许重复上传相同文件
    fileInput.value = ''
  }
}

// Delete selected images
const deleteSelected = () => {
  imageService.deleteSelectedImages()
}

// Export images
const exportImages = () => {
  imageService.exportImages(editingExifData.value)
}

// Watch for changes in selected images and update merged EXIF data
watch(selectedImageIds, async () => {
  if (selectedImageIds.value.length === 0) {
    mergedExifData.value = {}
    editingExifData.value = {}
    return
  }
  
  // Get selected images' EXIF data
  const selectedExifDataList = selectedImageIds.value
    .map(id => images.value.find(img => img.id === id)?.exifData)
    .filter(data => data) as IndexableExifData[]
  
  // Merge EXIF data
  mergedExifData.value = mergeExifData(selectedExifDataList) as IndexableExifData
  
  // Copy for editing
  editingExifData.value = {...mergedExifData.value}
})

// Format EXIF display
const getFormattedExifValue = (key: string) => {
  const value = mergedExifData.value[key]
  if (value === undefined) {
    return '-'
  } else if (value === null) {
    return t('exif.multipleValues')
  } else {
    return formatExifValue(key, value)
  }
}

// Apply edited EXIF data
const applyExifChanges = () => {
  imageService.updateImagesExif(editingExifData.value)
}

// Handle drag and drop upload
const handleDrop = async (event: DragEvent) => {
  event.preventDefault()
  
  if (event.dataTransfer?.files) {
    for (let i = 0; i < event.dataTransfer.files.length; i++) {
      const file = event.dataTransfer.files[i]
      if (file.type.startsWith('image/')) {
        await imageService.addImage(file)
      }
    }
  }
}

// Toggle selection of image
const toggleSelection = (id: string) => {
  imageService.toggleImageSelection(id)
}

// Prevent default drag and drop behavior
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

// Clean up resources when component is destroyed
onUnmounted(() => {
  imageService.releaseAllImages()
})
</script>

<template>
  <div class="app-container" :class="{ 'dark-mode': isDark }">
    <!-- 顶部区域 -->
    <header class="app-header">
      <h1 class="app-title">{{ t('app.title') }}</h1>
      
      <div class="app-controls">
        <button class="lang-btn" @click="toggleLocale">
          {{ locale === 'zh-CN' ? 'EN' : '中文' }}
        </button>
        
        <button class="theme-btn" @click="toggleDark()">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </div>
    </header>

    <div class="app-body">
      <!-- 左侧图片预览区域 -->
      <div class="preview-area">
        <div class="preview-controls">
          <button v-if="selectedImageIds.length > 0" @click="deleteSelected" class="control-btn">
            {{ t('app.delete') }}
          </button>
          <label class="upload-btn control-btn">
            {{ t('app.upload') }}
            <input type="file" accept="image/*" multiple @change="handleUpload" hidden>
          </label>
          
          <button class="export-btn control-btn" :disabled="selectedImageIds.length === 0" @click="exportImages">
            {{ t('app.export') }}
          </button>
          <span v-if="selectedImageIds.length > 0" class="selected-count">
            {{ t('app.selected', { count: selectedImageIds.length }) }}
          </span>
        </div>
        
        <div 
          class="image-grid" 
          @drop="handleDrop" 
          @dragover="handleDragOver"
        >
          <div 
            v-for="image in images" 
            :key="image.id" 
            class="image-item"
            :class="{ selected: selectedImageIds.includes(image.id) }"
            @click="toggleSelection(image.id)"
          >
            <img :src="image.url" :alt="image.file.name">
            <div class="image-name">{{ image.file.name }}</div>
          </div>
          
          <div class="upload-placeholder" v-if="images.length === 0">
            <div>{{ t('app.dropImagesHere') }}</div>
          </div>
        </div>
      </div>

      <!-- 右侧编辑功能区域 -->
      <div class="edit-area">
        <h2>{{ t('app.exifEditor') }}</h2>
        
        <div v-if="selectedImageIds.length === 0" class="no-selection">
          {{ t('app.selectImage') }}
        </div>
        
        <div v-else class="exif-editor">
          <!-- 基本信息 -->
          <div class="exif-group">
            <h3>{{ t('exif.basic') }}</h3>
            <div class="exif-content">
              <div v-for="key in basicExifKeys" :key="key" class="exif-item">
                <div class="exif-key">{{ t(`exif.${key}`) }}</div>
                <div class="exif-value">{{ getFormattedExifValue(key) }}</div>
              </div>
            </div>
          </div>

          <!-- 位置信息 -->
          <div class="exif-group">
            <h3>{{ t('exif.location') }}</h3>
            <div class="exif-content">
              <div v-for="key in locationExifKeys" :key="key" class="exif-item">
                <div class="exif-key">{{ t(`exif.${key}`) }}</div>
                <div class="exif-value">
                  <template v-if="key in editingComponentMap">
                    <input 
                      v-if="editingComponentMap[key] === 'text'"
                      type="text" 
                      v-model="editingExifData[key]"
                      :placeholder="getFormattedExifValue(key)"
                    >
                    <input 
                      v-else-if="editingComponentMap[key] === 'number'"
                      type="number" 
                      v-model.number="editingExifData[key]"
                      :placeholder="getFormattedExifValue(key)"
                      step="0.000001"
                    >
                    <span v-else>{{ getFormattedExifValue(key) }}</span>
                  </template>
                  <span v-else>{{ getFormattedExifValue(key) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 相机信息 -->
          <div class="exif-group">
            <h3>{{ t('exif.camera') }}</h3>
            <div class="exif-content">
              <div v-for="key in cameraExifKeys" :key="key" class="exif-item">
                <div class="exif-key">{{ t(`exif.${key}`) }}</div>
                <div class="exif-value">
                  <template v-if="key in editingComponentMap">
                    <input 
                      v-if="editingComponentMap[key] === 'text'"
                      type="text" 
                      v-model="editingExifData[key]"
                      :placeholder="getFormattedExifValue(key)"
                    >
                    <input 
                      v-else-if="editingComponentMap[key] === 'number'"
                      type="number" 
                      v-model.number="editingExifData[key]"
                      :placeholder="getFormattedExifValue(key)"
                    >
                    <span v-else>{{ getFormattedExifValue(key) }}</span>
                  </template>
                  <span v-else>{{ getFormattedExifValue(key) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 应用按钮 -->
          <div class="exif-actions">
            <button @click="applyExifChanges" class="apply-button">
              {{ t('app.apply') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --primary-bg: #ffffff;
  --secondary-bg: #f5f5f5;
  --primary-text: #333333;
  --secondary-text: #666666;
  --border-color: #dddddd;
  --accent-color: #3880ff;
  --section-gap: 2rem;
}

.dark-mode {
  --primary-bg: #1e1e1e;
  --secondary-bg: #2d2d2d;
  --primary-text: #ffffff;
  --secondary-text: #bbbbbb;
  --border-color: #444444;
  --accent-color: #5a9eff;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  background-color: var(--primary-bg);
  color: var(--primary-text);
  width: 100%;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  max-width: 100%;
  background-color: var(--primary-bg);
  color: var(--primary-text);
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.app-controls {
  display: flex;
  gap: 0.5rem;
  margin-right: 1rem;
}

button, .upload-btn {
  padding: 0.5rem 1rem;
  background-color: var(--secondary-bg);
  color: var(--primary-text);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s, opacity 0.2s;
}

button:hover, .upload-btn:hover {
  background-color: var(--border-color);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.app-body {
  display: flex;
  flex: 1;
  height: calc(100vh - 70px);
}

.preview-area {
  flex: 4;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border-color);
  overflow: hidden;
}

.preview-controls {
  padding: 0.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.control-btn {
  padding: 0.3rem 0.7rem;
  font-size: 0.85rem;
}

.selected-count {
  color: var(--secondary-text);
  font-size: 0.9rem;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1rem;
  overflow-y: auto;
  flex: 1;
}

.image-item {
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s, border-color 0.2s;
}

.image-item:hover {
  transform: scale(1.02);
}

.image-item.selected {
  border-color: var(--accent-color);
}

.image-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.image-name {
  font-size: 0.8rem;
  padding: 0.25rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  background-color: var(--secondary-bg);
}

.upload-placeholder {
  grid-column: 1 / -1;
  height: 300px;
  border: 2px dashed var(--border-color);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
}

.edit-area {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.edit-area h2 {
  margin-bottom: 1rem;
}

.exif-group {
  margin-bottom: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.exif-group h3 {
  padding: 0.5rem;
  background-color: var(--secondary-bg);
  border-bottom: 1px solid var(--border-color);
  font-size: 1rem;
  margin: 0;
}

.exif-content {
  padding: 0.5rem;
}

.exif-item {
  display: flex;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.exif-item:last-child {
  border-bottom: none;
}

.exif-key {
  flex: 1;
  color: var(--secondary-text);
}

.exif-value {
  flex: 2;
}

.exif-value input {
  width: 100%;
  padding: 0.25rem;
  background-color: var(--primary-bg);
  color: var(--primary-text);
  border: 1px solid var(--border-color);
  border-radius: 3px;
}

.no-selection {
  padding: 2rem;
  text-align: center;
  color: var(--secondary-text);
}

.exif-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.apply-button {
  background-color: var(--accent-color);
  color: white;
  border: none;
}

.apply-button:hover {
  opacity: 0.9;
  background-color: var(--accent-color);
}
</style>
