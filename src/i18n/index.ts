import { createI18n } from 'vue-i18n'

const messages = {
  'en': {
    app: {
      title: 'EXIF Editor Online',
      upload: 'Upload',
      export: 'Export',
      delete: 'Delete',
      dropImagesHere: 'Drop images here or click to upload',
      selectImage: 'Select an image to edit EXIF data',
      exifEditor: 'EXIF Editor',
      selected: '{count} selected',
      apply: 'Apply Changes'
    },
    exif: {
      basic: 'Basic Information',
      camera: 'Camera Information',
      location: 'Location Information',
      multipleValues: 'Multiple Values',
      fileName: 'File Name',
      fileSize: 'File Size',
      fileType: 'File Type',
      dimensions: 'Dimensions',
      dateCreated: 'Date Created',
      dateModified: 'Date Modified',
      make: 'Make',
      model: 'Model',
      lens: 'Lens',
      focalLength: 'Focal Length',
      aperture: 'Aperture',
      shutterSpeed: 'Shutter Speed',
      iso: 'ISO',
      latitude: 'Latitude',
      longitude: 'Longitude',
      altitude: 'Altitude',
      locationName: 'Location Name',
      ImageWidth: 'Width',
      ImageHeight: 'Height',
      CreateDate: 'Created',
      ModifyDate: 'Modified',
      LensModel: 'Lens',
      FocalLength: 'Focal Length',
      FNumber: 'Aperture',
      ExposureTime: 'Shutter Speed',
      ISO: 'ISO',
      GPSImgDirection: 'Direction'
    }
  },
  'zh-CN': {
    app: {
      title: 'EXIF 在线编辑器',
      upload: '上传',
      export: '导出',
      delete: '删除',
      dropImagesHere: '拖拽图片到此处或点击上传',
      selectImage: '选择一张图片编辑EXIF数据',
      exifEditor: 'EXIF编辑器',
      selected: '已选择 {count} 项',
      apply: '应用更改'
    },
    exif: {
      basic: '基本信息',
      camera: '相机信息',
      location: '位置信息',
      multipleValues: '多个值',
      fileName: '文件名',
      fileSize: '文件大小',
      fileType: '文件类型',
      dimensions: '尺寸',
      dateCreated: '创建日期',
      dateModified: '修改日期',
      make: '制造商',
      model: '型号',
      lens: '镜头',
      focalLength: '焦距',
      aperture: '光圈',
      shutterSpeed: '快门速度',
      iso: 'ISO感光度',
      latitude: '纬度',
      longitude: '经度',
      altitude: '海拔',
      locationName: '位置名称',
      ImageWidth: '宽度',
      ImageHeight: '高度',
      CreateDate: '创建时间',
      ModifyDate: '修改时间',
      LensModel: '镜头',
      FocalLength: '焦距',
      FNumber: '光圈',
      ExposureTime: '曝光时间',
      ISO: 'ISO感光度',
      GPSImgDirection: '方向'
    }
  }
}

export default createI18n({
  legacy: false,
  locale: 'zh-CN', // 默认语言为中文
  fallbackLocale: 'en',
  messages
}) 