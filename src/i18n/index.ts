import { createI18n } from 'vue-i18n'

// 中文翻译
const zh = {
  title: 'EXIF 在线编辑器',
  upload: {
    placeholder: '点击或拖拽图片到此区域上传'
  },
  editor: {
    title: 'EXIF 编辑区域 (开发中)'
  },
  lang: {
    zh: '中文',
    en: 'English'
  }
}

// 英文翻译
const en = {
  title: 'EXIF Online Editor',
  upload: {
    placeholder: 'Click or drag image to this area to upload'
  },
  editor: {
    title: 'EXIF Editor Area (Under Development)'
  },
  lang: {
    zh: '中文',
    en: 'English'
  }
}

// 创建i18n实例
const i18n = createI18n({
  legacy: false, // 使用组合式 API
  locale: 'zh', // 默认语言
  fallbackLocale: 'en', // 回退语言
  messages: {
    zh,
    en
  }
})

export default i18n 