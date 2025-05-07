import { ref } from 'vue'
import { readExif, writeExif, type ExifData } from './exifService'

// Add index signature to ExifData
export interface IndexableExifData extends ExifData {
  [key: string]: string | number | Date | null | undefined;
}

// Image object interface
export interface ImageItem {
  id: string;
  file: File;
  url: string;
  exifData?: IndexableExifData;
}

// Image list
const images = ref<ImageItem[]>([])

// Selected image ID list
const selectedImageIds = ref<string[]>([])

/**
 * Upload images
 */
export async function uploadImages(files: FileList): Promise<void> {
  for (let i = 0; i < files.length; i++) {
    await addImage(files[i])
  }
}

/**
 * Add a single image
 */
export async function addImage(file: File): Promise<void> {
  // Only process image files
  if (!file.type.startsWith('image/')) {
    console.warn('Unsupported file type:', file.type)
    return
  }

  const id = Date.now() + Math.random().toString(36).substring(2, 9)
  const url = URL.createObjectURL(file)
  
  // Read EXIF data
  const exifData = await readExif(file)
  
  images.value.push({ 
    id, 
    file, 
    url, 
    exifData: exifData as IndexableExifData 
  })
}

/**
 * Delete selected images
 */
export function deleteSelectedImages(): void {
  images.value = images.value.filter(image => !selectedImageIds.value.includes(image.id))
  selectedImageIds.value = []
}

/**
 * Export images
 */
export async function exportImages(exifData: IndexableExifData): Promise<void> {
  // No selected images, do not execute export
  if (selectedImageIds.value.length === 0) return
  
  // Iterate through selected images
  for (const imageId of selectedImageIds.value) {
    const image = images.value.find(img => img.id === imageId)
    if (!image) continue
    
    // Update image with the provided EXIF data
    const updatedBlob = await writeExif(image.file, exifData)
    
    // Create download link
    const downloadUrl = URL.createObjectURL(updatedBlob)
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = image.file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(downloadUrl)
  }
}

/**
 * Update image EXIF data
 */
export function updateImagesExif(exifData: IndexableExifData): void {
  // No selected images, do not execute update
  if (selectedImageIds.value.length === 0) return
  
  // Update EXIF data for selected images
  for (const imageId of selectedImageIds.value) {
    const imageIndex = images.value.findIndex(img => img.id === imageId)
    if (imageIndex !== -1) {
      // Merge original EXIF and edited EXIF
      const originalExif = images.value[imageIndex].exifData || {}
      
      // Only update edited fields
      images.value[imageIndex].exifData = {
        ...originalExif,
        ...exifData
      }
    }
  }
}

// Get all images
export function getImages() {
  return images
}

// Get selected image ID list
export function getSelectedImageIds() {
  return selectedImageIds
}

// Add selected image
export function addSelectedImage(id: string): void {
  if (!selectedImageIds.value.includes(id)) {
    selectedImageIds.value.push(id)
  }
}

// Remove selected image
export function removeSelectedImage(id: string): void {
  selectedImageIds.value = selectedImageIds.value.filter(imageId => imageId !== id)
}

// Toggle image selection status
export function toggleImageSelection(id: string): void {
  if (selectedImageIds.value.includes(id)) {
    removeSelectedImage(id)
  } else {
    addSelectedImage(id)
  }
}

// Clear all selections
export function clearSelection(): void {
  selectedImageIds.value = []
}

// Release all image resources
export function releaseAllImages(): void {
  images.value.forEach(image => {
    URL.revokeObjectURL(image.url)
  })
  images.value = []
  selectedImageIds.value = []
} 