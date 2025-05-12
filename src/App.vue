<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { watchEffect, ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import PhotoUpload from './components/PhotoUpload.vue'
import PhotoItem from './components/PhotoItem.vue'
import ExifEditor from './components/ExifEditor.vue'

const { t } = useI18n()

// Watch for language changes and update page title
watchEffect(() => {
  document.title = t('title')
})

// Photo list related states
interface PhotoItem {
  id: string
  url: string
  name: string
  selected: boolean
}

const photos = ref<PhotoItem[]>([])
const hasPhotos = computed(() => photos.value.length > 0)
const selectedCount = computed(() => photos.value.filter(photo => photo.selected).length)
const allSelected = computed(() => photos.value.length > 0 && selectedCount.value === photos.value.length)
const uploadRef = ref<HTMLElement | null>(null)

// Handle image upload
function handleImageUpload(file: { url: string, name: string, id: string }) {
  photos.value.push({
    ...file,
    selected: false
  })
}

// Toggle selection of a single photo
function toggleSelect(photoId: string) {
  const photo = photos.value.find(p => p.id === photoId)
  if (photo) {
    photo.selected = !photo.selected
  }
}

// Toggle select all photos
function toggleSelectAll() {
  const newState = !allSelected.value
  photos.value.forEach(photo => {
    photo.selected = newState
  })
}

// Delete selected photos
function deleteSelected() {
  if (selectedCount.value === 0) {
    ElMessage.warning(t('photos.noSelection'))
    return
  }

  ElMessageBox.confirm(
    t('photos.confirmDelete', { count: selectedCount.value }),
    t('photos.deleteConfirmTitle'),
    { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
  ).then(() => {
    photos.value = photos.value.filter(photo => !photo.selected)
    ElMessage.success(t('photos.deleteSuccess'))
  }).catch(() => {
    // User canceled operation
  })
}

// Show upload component
function showUpload() {
  // Simulate click on the hidden upload component's input
  const uploadEl = uploadRef.value
  if (uploadEl) {
    const inputEl = uploadEl.querySelector('input[type="file"]') as HTMLInputElement
    if (inputEl) {
      inputEl.click()
    }
  }
}
</script>

<template>
  <div class="app-container">
    <!-- Top Banner -->
    <header class="app-header">
      <div class="header-content">
        <h1 class="header-title">{{ t('title') }}</h1>
        <div class="header-actions">
          <LanguageSwitcher />
          <a 
            href="https://github.com/bluicezhen/exif-editor-online" 
            target="_blank" 
            class="github-link"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="app-content">
      <!-- Left Photo Display Area -->
      <div class="photo-area">
        <!-- Photo toolbar -->
        <div v-if="hasPhotos" class="photo-toolbar">
          <div class="toolbar-actions">
            <el-button type="primary" @click="showUpload">{{ t('photos.upload') }}</el-button>
            <el-button type="info" @click="toggleSelectAll">
              {{ allSelected ? t('photos.deselectAll') : t('photos.selectAll') }}
            </el-button>
            <el-button type="danger" @click="deleteSelected" :disabled="selectedCount === 0">
              {{ t('photos.delete') }} <span v-if="selectedCount > 0">({{ selectedCount }})</span>
            </el-button>
          </div>
          <div class="photo-count">
            {{ t('photos.count', { count: photos.length }) }}
          </div>
        </div>
        
        <!-- Show upload component when no photos -->
        <div v-if="!hasPhotos" class="full-height">
          <PhotoUpload @upload-image="handleImageUpload" />
        </div>
        
        <!-- Photo grid -->
        <div v-else class="photo-grid">
          <PhotoItem
            v-for="photo in photos"
            :key="photo.id"
            :id="photo.id"
            :url="photo.url"
            :name="photo.name"
            v-model:selected="photo.selected"
            @select="toggleSelect"
          />
        </div>
        
        <!-- Hidden upload component for later uploads -->
        <div class="upload-hidden">
          <PhotoUpload ref="uploadRef" @upload-image="handleImageUpload" />
        </div>
      </div>

      <!-- Right EXIF Editor Area -->
      <div class="exif-area">
        <ExifEditor />
      </div>
    </main>
  </div>
</template>

<style>
/* Global reset styles to ensure consistent layout */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

#app {
  height: 100%;
  width: 100%;
}

/* Element Plus button overrides - must be in non-scoped style block */
.el-button {
  background-color: var(--el-button-bg-color, var(--el-color-white)) !important;
}

.el-button--primary {
  background-color: var(--el-color-primary) !important;
}

.el-button--success {
  background-color: var(--el-color-success) !important;
}

.el-button--warning {
  background-color: var(--el-color-warning) !important;
}

.el-button--danger {
  background-color: var(--el-color-danger) !important;
}

.el-button--info {
  background-color: var(--el-color-info) !important;
}
</style>

<style scoped>
/* Main container - fills viewport */
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: #f5f5f5;
  overflow: hidden;
}

/* Header styles */
.app-header {
  background-color: #1f2937; /* Dark background for header */
  color: white;
  flex: 0 0 auto; /* Fixed height, won't grow or shrink */
}

.header-content {
  padding: 0 1rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.github-link {
  color: #d1d5db;
  transition: color 0.2s;
}

.github-link:hover {
  color: white;
}

/* Main content area - takes remaining height */
.app-content {
  flex: 1;
  display: flex;
  height: calc(100vh - 4rem); /* Viewport height minus header */
  padding: 1rem;
  overflow: hidden;
}

/* Left side - photo area (75% width) */
.photo-area {
  width: 75%;
  height: 100%;
  position: relative;
  padding-right: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Right side - EXIF editor area (25% width) */
.exif-area {
  width: 25%;
  height: 100%;
  position: relative;
  border-left: 1px solid #e0e0e0;
  background-color: white;
  border-radius: 4px;
  overflow: hidden;
}

/* Photo toolbar */
.photo-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  background-color: white;
  padding: 0.75rem;
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  flex: 0 0 auto; /* Fixed height */
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.photo-count {
  color: #6b7280;
  font-size: 0.875rem;
}

/* Full height container for upload placeholder */
.full-height {
  height: 100%;
  flex: 1;
  overflow: hidden;
}

/* Photo grid with scrolling */
.photo-grid {
  flex: 1;
  overflow-y: auto;
  padding: 0 0 1rem 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

/* Responsive grid layouts */
@media (min-width: 768px) {
  .photo-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1024px) {
  .photo-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

/* Hidden upload component */
.upload-hidden {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  opacity: 0;
}
</style>
