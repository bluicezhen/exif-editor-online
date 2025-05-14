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
    title: 'EXIF 编辑器',
    noPhotos: '请先上传照片',
    noSelection: '请选择照片以编辑EXIF信息',
    noExifData: '所选照片没有EXIF信息',
    selectedCount: '已选择{count}张照片',
    multipleValues: '多个值',
    saveSuccess: '保存成功',
    sections: {
      gps: 'GPS定位信息',
      basic: '基本信息',
      camera: '拍摄参数',
      other: '其他信息'
    },
    fields: {
      // GPS Fields
      gpsLatitude: '纬度',
      gpsLongitude: '经度',
      gpsAltitude: '海拔',
      
      // Basic Fields
      make: '制造商',
      model: '型号',
      software: '软件',
      modifyDate: '修改日期',
      createDate: '创建日期',
      dateTimeOriginal: '拍摄日期',
      
      // Camera Fields
      fNumber: '光圈值',
      exposureTime: '曝光时间',
      iso: 'ISO',
      focalLength: '焦距',
      lensModel: '镜头型号',
      flash: '闪光灯',
      whiteBalance: '白平衡',
      exposureProgram: '曝光程序',
      exposureCompensation: '曝光补偿',
      meteringMode: '测光模式'
    }
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
    deleteSuccess: '删除成功',
    parsingExif: '正在解析EXIF'
  },
  common: {
    confirm: '确认',
    cancel: '取消',
    error: '发生错误'
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
    title: 'EXIF Editor',
    noPhotos: 'Please upload photos first',
    noSelection: 'Please select photos to edit EXIF information',
    noExifData: 'Selected photos have no EXIF information',
    selectedCount: '{count} photos selected',
    multipleValues: 'Multiple values',
    saveSuccess: 'Saved successfully',
    sections: {
      gps: 'GPS Location',
      basic: 'Basic Information',
      camera: 'Camera Parameters',
      other: 'Other Information'
    },
    fields: {
      // GPS Fields
      gpsLatitude: 'Latitude',
      gpsLongitude: 'Longitude',
      gpsAltitude: 'Altitude',
      
      // Basic Fields
      make: 'Manufacturer',
      model: 'Model',
      software: 'Software',
      modifyDate: 'Modified Date',
      createDate: 'Created Date',
      dateTimeOriginal: 'Original Date',
      
      // Camera Fields
      fNumber: 'Aperture',
      exposureTime: 'Exposure Time',
      iso: 'ISO',
      focalLength: 'Focal Length',
      lensModel: 'Lens Model',
      flash: 'Flash',
      whiteBalance: 'White Balance',
      exposureProgram: 'Exposure Program',
      exposureCompensation: 'Exposure Compensation',
      meteringMode: 'Metering Mode'
    }
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
    deleteSuccess: 'Deleted successfully',
    parsingExif: 'Parsing EXIF'
  },
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    error: 'An error occurred'
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