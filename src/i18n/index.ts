import { createI18n } from 'vue-i18n'

// Chinese translations
const zh = {
  title: 'EXIF 在线编辑器',
  upload: {
    placeholder: '点击或拖拽图片到此区域上传',
    onlyImages: '只允许上传图片文件！',
    sizeExceeded: '图片大小不能超过 {size}MB',
    imageLoadError: '图片加载失败，请重试'
  },
  editor: {
    title: 'EXIF 编辑区域 (开发中)'
  },
  lang: {
    zh: '中文',
    en: 'English'
  },
  photos: {
    upload: '上传',
    selectAll: '全选',
    deselectAll: '取消全选',
    delete: '删除',
    count: '共 {count} 张图片',
    noSelection: '请先选择要删除的图片',
    confirmDelete: '确认删除{count}张已选中的图片吗？',
    deleteConfirmTitle: '删除确认',
    deleteSuccess: '删除成功'
  },
  common: {
    confirm: '确认',
    cancel: '取消'
  }
}

// English translations
const en = {
  title: 'EXIF Online Editor',
  upload: {
    placeholder: 'Click or drag image to this area to upload',
    onlyImages: 'Only image files are allowed!',
    sizeExceeded: 'Image size cannot exceed {size}MB',
    imageLoadError: 'Failed to load image, please try again'
  },
  editor: {
    title: 'EXIF Editor Area (Under Development)'
  },
  lang: {
    zh: '中文',
    en: 'English'
  },
  photos: {
    upload: 'Upload',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    delete: 'Delete',
    count: '{count} Photos',
    noSelection: 'Please select photos to delete',
    confirmDelete: 'Confirm to delete {count} selected photos?',
    deleteConfirmTitle: 'Delete Confirmation',
    deleteSuccess: 'Deleted successfully'
  },
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel'
  }
}

// Create i18n instance
const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'zh', // Default language
  fallbackLocale: 'en', // Fallback language
  messages: {
    zh,
    en
  }
})

export default i18n 