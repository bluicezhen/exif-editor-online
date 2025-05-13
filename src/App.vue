<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { watchEffect, ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import PhotoUpload from './components/PhotoUpload.vue'
import PhotoItem from './components/PhotoItem.vue'
import ExifEditor from './components/ExifEditor.vue'
import './assets/styles/main.scss'

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
const uploadRef = ref<InstanceType<typeof PhotoUpload> | null>(null)

// Handle image upload
function handleImageUpload(files: Array<{ url: string, name: string, id: string }>) {
  // Add each uploaded file to photos array
  files.forEach(file => {
    photos.value.push({
      ...file,
      selected: false
    })
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

// Show upload dialog by triggering file input click
function showUpload() {
  // Find the upload component and simulate a click on its file input
  if (uploadRef.value) {
    const uploadEl = uploadRef.value.$el
    const inputEl = uploadEl.querySelector('input[type="file"]')
    if (inputEl) {
      inputEl.click()
    }
  }
}
</script>

<template>
  <div class="app-container">
    <!-- Header -->
    <header class="app-header">
      <h1 class="header-title">{{ t('title') }}</h1>
      <div class="header-actions">
        <LanguageSwitcher />
        <ThemeSwitcher />
        <a 
          href="https://github.com/bluicezhen/exif-editor-online" 
          target="_blank" 
          class="github-link"
          title="GitHub"
        >
          GitHub
        </a>
      </div>
    </header>

    <!-- Main Content -->
    <main class="app-content">
      <!-- Left Photo Display Area -->
      <section class="photo-area">
        <!-- Photo toolbar -->
        <div v-if="hasPhotos" class="photo-toolbar">
          <div class="toolbar-actions">
            <el-button type="info" size="small" @click="showUpload">{{ t('photos.upload') }}</el-button>
            <el-button type="info" size="small" @click="toggleSelectAll">
              {{ allSelected ? t('photos.deselectAll') : t('photos.selectAll') }}
            </el-button>
            <el-button type="info" size="small" @click="deleteSelected" :disabled="selectedCount === 0">
              {{ t('photos.delete') }} <span v-if="selectedCount > 0">({{ selectedCount }})</span>
            </el-button>
          </div>
          <div class="photo-count">
            {{ t('photos.count', { count: photos.length }) }}
          </div>
        </div>
        
        <!-- Show upload component when no photos -->
        <PhotoUpload v-if="!hasPhotos" @upload-images="handleImageUpload" class="full-height" />
        
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
        <PhotoUpload ref="uploadRef" @upload-images="handleImageUpload" class="upload-hidden" />
      </section>

      <!-- Right EXIF Editor Area -->
      <section class="exif-area">
        <ExifEditor />
      </section>
    </main>
  </div>
</template>

<style lang="scss">
@use './assets/styles/main';
</style>

<style lang="scss" scoped>
@use './assets/styles/abstracts' as *;

/* Main container - fills viewport */
.app-container {
  @include flex(column);
  height: 100vh;
  width: 100%;
  background-color: var(--bg-secondary);
  overflow: hidden;
}

/* Header styles */
.app-header {
  background-color: var(--header-bg);
  color: var(--header-text);
  flex: 0 0 auto; /* Fixed height, won't grow or shrink */
  padding: 0 $spacing-base;
  height: $header-height;
  width: 100%;
  @include flex(row, space-between, center);

  .header-title {
    font-size: 1.25rem;
    font-weight: 500;
    margin-left: 1.25rem;
  }

  .header-actions {
    @include flex(row, center, center, $spacing-lg);
    margin-right: 1.25rem;
  }

  .github-link {
    color: $color-text-light;
    font-size: 1rem;
    @include transition(color);

    &:hover {
      color: var(--header-text);
    }
  }
}

/* Main content area - takes remaining height */
.app-content {
  flex: 1;
  @include flex(row);
  height: calc(100vh - #{$header-height});
  padding: $spacing-base;
  overflow: hidden;
  width: 100%;
}

/* Left side - photo area (75% width) */
.photo-area {
  width: 75%;
  height: 100%;
  position: relative;
  padding-right: $spacing-base;
  padding-left: $spacing-base;
  overflow: hidden;
  @include flex(column);
}

/* Right side - EXIF editor area (25% width) */
.exif-area {
  width: 25%;
  height: 100%;
  position: relative;
  background-color: var(--bg-primary);
  border-radius: $border-radius;
  overflow: hidden;
  margin-right: $spacing-base;

  .dark-mode & {
    background-color: var(--bg-primary);
    color: var(--text-primary);
  }
}

/* Photo toolbar */
.photo-toolbar {
  @include flex(row, space-between, center);
  margin-bottom: $spacing-base;
  @include card($spacing-md);
  flex: 0 0 auto; /* Fixed height */
  width: 100%;

  .dark-mode & {
    background-color: var(--bg-primary);
    color: var(--text-primary);
  }

  .toolbar-actions {
    @include flex(row, center, center, $spacing-md);
  }

  .photo-count {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
}

/* Full height container for upload placeholder */
.full-height {
  height: 100%;
  flex: 1;
  overflow: hidden;
  background-color: var(--bg-primary);
  border-radius: $border-radius;

  .dark-mode & {
    background-color: var(--bg-primary);
    color: var(--text-primary);
  }
}

/* Photo grid with scrolling */
.photo-grid {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden; /* Prevent horizontal scrolling */
  padding: 0 0 $spacing-base 0;
  @include grid(3, $spacing-sm); /* Reduced gap between grid items */
  
  /* Desktop first approach - starting with larger grid */
  grid-template-columns: repeat(6, 1fr); /* Increased from 5 to 6 columns */
  
  /* Show scrollbar for better UX */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--bg-secondary);
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--text-secondary);
    border-radius: 4px;
  }
  
  @media (max-width: $breakpoint-lg) {
    grid-template-columns: repeat(5, 1fr); /* Increased from 4 to 5 columns */
  }
  
  @media (max-width: $breakpoint-md) {
    grid-template-columns: repeat(4, 1fr); /* Increased from 3 to 4 columns */
  }
  
  /* For smaller screens use 3 columns */
  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Hidden upload component */
.upload-hidden {
  position: absolute;
  @include fixed-size(0);
  overflow: hidden;
  opacity: 0;
}
</style>
