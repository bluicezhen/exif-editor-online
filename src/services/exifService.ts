import * as exifr from 'exifr'

export interface ExifData {
  // 基本信息
  FileName?: string | null
  FileSize?: number | null
  FileType?: string | null
  ImageWidth?: number | null
  ImageHeight?: number | null
  ModifyDate?: Date | null
  CreateDate?: Date | null

  // 相机信息
  Make?: string | null
  Model?: string | null
  LensModel?: string | null
  FocalLength?: number | null
  FNumber?: number | null
  ExposureTime?: number | string | null
  ISO?: number | null

  // 位置信息
  latitude?: number | null
  longitude?: number | null
  altitude?: number | null
  GPSImgDirection?: number | null
  GPSSpeed?: number | null
}

/**
 * Read EXIF data from image files
 */
export async function readExif(file: File): Promise<ExifData> {
  try {
    // 读取所有可能的EXIF数据
    const fullOutput = await exifr.parse(file, { tiff: true, xmp: true, icc: true, iptc: true, gps: true })
    
    // 构建基本信息
    const exifData: ExifData = {
      FileName: file.name,
      FileSize: file.size,
      FileType: file.type,
      ...fullOutput
    }

    return exifData
  } catch (error) {
    console.error('读取EXIF数据失败:', error)
    // 如果读取失败，至少返回文件基本信息
    return {
      FileName: file.name,
      FileSize: file.size,
      FileType: file.type
    }
  }
}

/**
 * Merge EXIF data from multiple images
 * If a property value differs among images, the value will be null, indicating "multiple values"
 */
export function mergeExifData(exifDataList: ExifData[]): ExifData {
  if (exifDataList.length === 0) {
    return {}
  }
  
  if (exifDataList.length === 1) {
    return exifDataList[0]
  }

  const result: ExifData = {}
  const props = Object.keys(exifDataList[0]) as Array<keyof ExifData>

  for (const prop of props) {
    // 检查所有图片该属性是否相同
    const firstValue = exifDataList[0][prop]
    const allSame = exifDataList.every(data => {
      if (data[prop] === undefined && firstValue === undefined) return true
      if (data[prop] instanceof Date && firstValue instanceof Date) {
        return data[prop]?.getTime() === firstValue.getTime()
      }
      return data[prop] === firstValue
    })

    if (allSame) {
      (result as any)[prop] = firstValue
    } else {
      // 使用null表示多个值
      (result as any)[prop] = null
    }
  }

  return result
}

/**
 * Write EXIF data to an image (currently just a simulated implementation)
 * In actual applications, a more specialized library is needed for processing
 */
export async function writeExif(file: File, exifData: ExifData): Promise<Blob> {
  // 这里只是示例，实际应用中需要使用更专业的库
  console.log('写入EXIF数据:', exifData)
  
  // 在实际应用中，应该在这里修改图片的EXIF数据并返回新的Blob
  // 目前，我们只返回原始文件
  return new Blob([await file.arrayBuffer()], { type: file.type })
}

/**
 * Format EXIF display values
 */
export function formatExifValue(key: string, value: any): string {
  if (value === undefined || value === null) {
    return '-'
  }

  switch (key) {
    case 'FileSize':
      return formatFileSize(value)
    case 'CreateDate':
    case 'ModifyDate':
      return formatDate(value)
    case 'FocalLength':
      return `${value}mm`
    case 'FNumber':
      return `f/${value}`
    case 'ExposureTime':
      return formatExposureTime(value)
    case 'latitude':
    case 'longitude':
      return formatCoordinate(value)
    case 'altitude':
      return `${value}m`
    default:
      return String(value)
  }
}

function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size} B`
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`
  }
}

function formatDate(date: Date): string {
  return date.toLocaleString()
}

function formatExposureTime(value: number | string): string {
  if (typeof value === 'number') {
    if (value < 1) {
      const denominator = Math.round(1 / value)
      return `1/${denominator}s`
    } else {
      return `${value}s`
    }
  }
  return String(value)
}

function formatCoordinate(value: number): string {
  return value.toFixed(6) + '°'
} 