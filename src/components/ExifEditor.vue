<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ref, inject, watch } from 'vue'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

// Get photos and selected state from app
const photos = inject<any>('photos')
const exifStore = inject<any>('exifStore')

// No data message state
const noDataMessage = computed(() => {
  if (!photos?.value?.length) return t('editor.noPhotos')
  if (!selectedPhotos.value.length) return t('editor.noSelection')
  return t('editor.noExifData')
})

// Get selected photos
const selectedPhotos = computed(() => {
  if (!photos?.value) return []
  return photos.value.filter((photo: any) => photo.selected)
})

// Track if we have selected photos
const hasSelectedPhotos = computed(() => selectedPhotos.value.length > 0)

// Get EXIF data for selected photos
const selectedPhotosExif = computed(() => {
  if (!selectedPhotos.value.length || !exifStore?.value) return []
  
  return selectedPhotos.value
    .map((photo: any) => {
      const exifData = exifStore.value[photo.id]
      return exifData ? { photoId: photo.id, exifData } : null
    })
    .filter(Boolean)
})

// Active editing section
const activeSection = ref<string | null>(null)

// Categorize EXIF data into sections
interface ExifField {
  key: string
  label: string
  originalValues: Record<string, any>
  displayValue: any
  isMultipleValues: boolean
  editable: boolean
  type: 'text' | 'number' | 'date' | 'gps'
  editValue: any
}

interface ExifSection {
  title: string
  fields: ExifField[]
}

// Define the order of sections and fields
const sections = ref<ExifSection[]>([
  {
    title: 'editor.sections.gps',
    fields: []
  },
  {
    title: 'editor.sections.basic',
    fields: []
  },
  {
    title: 'editor.sections.camera',
    fields: []
  },
  {
    title: 'editor.sections.other',
    fields: []
  }
])

// Define which fields belong to which category
const fieldCategories: Record<string, string> = {
  // GPS Fields
  GPSLatitude: 'editor.sections.gps',
  GPSLongitude: 'editor.sections.gps',
  GPSAltitude: 'editor.sections.gps',
  
  // Basic Fields
  Make: 'editor.sections.basic',
  Model: 'editor.sections.basic',
  Software: 'editor.sections.basic',
  ModifyDate: 'editor.sections.basic',
  CreateDate: 'editor.sections.basic',
  DateTimeOriginal: 'editor.sections.basic',
  
  // Camera Fields
  FNumber: 'editor.sections.camera',
  ExposureTime: 'editor.sections.camera',
  ISO: 'editor.sections.camera',
  FocalLength: 'editor.sections.camera',
  LensModel: 'editor.sections.camera',
  Flash: 'editor.sections.camera',
  WhiteBalance: 'editor.sections.camera',
  ExposureProgram: 'editor.sections.camera',
  ExposureCompensation: 'editor.sections.camera',
  MeteringMode: 'editor.sections.camera',
  
  // All other fields will go to "Other" section
}

// Field labels translations
const fieldLabels: Record<string, string> = {
  // GPS Fields
  GPSLatitude: 'editor.fields.gpsLatitude',
  GPSLongitude: 'editor.fields.gpsLongitude',
  GPSAltitude: 'editor.fields.gpsAltitude',
  
  // Basic Fields
  Make: 'editor.fields.make',
  Model: 'editor.fields.model',
  Software: 'editor.fields.software',
  ModifyDate: 'editor.fields.modifyDate',
  CreateDate: 'editor.fields.createDate',
  DateTimeOriginal: 'editor.fields.dateTimeOriginal',
  
  // Camera Fields
  FNumber: 'editor.fields.fNumber',
  ExposureTime: 'editor.fields.exposureTime',
  ISO: 'editor.fields.iso',
  FocalLength: 'editor.fields.focalLength',
  LensModel: 'editor.fields.lensModel',
  Flash: 'editor.fields.flash',
  WhiteBalance: 'editor.fields.whiteBalance',
  ExposureProgram: 'editor.fields.exposureProgram',
  ExposureCompensation: 'editor.fields.exposureCompensation',
  MeteringMode: 'editor.fields.meteringMode'
}

// Field types
const fieldTypes: Record<string, 'text' | 'number' | 'date' | 'gps'> = {
  // GPS Fields
  GPSLatitude: 'gps',
  GPSLongitude: 'gps',
  GPSAltitude: 'number',
  
  // Date Fields
  ModifyDate: 'date',
  CreateDate: 'date',
  DateTimeOriginal: 'date',
  
  // Number Fields
  FNumber: 'number',
  ExposureTime: 'number',
  ISO: 'number',
  FocalLength: 'number',
  ExposureCompensation: 'number'
}

// Format field value for display
function formatFieldValue(key: string, value: any): string {
  if (value === undefined || value === null) return '';
  
  // Handle specific field formatting
  switch (key) {
    case 'FNumber':
      return `f/${value}`;
    case 'ExposureTime':
      // Convert decimal to fraction (e.g., 0.005 -> 1/200)
      if (value < 1) {
        const denominator = Math.round(1 / value);
        return `1/${denominator}s`;
      }
      return `${value}s`;
    case 'FocalLength':
      return `${value}mm`;
    case 'GPSLatitude':
    case 'GPSLongitude':
      // Format GPS coordinates
      if (Array.isArray(value)) {
        const direction = key === 'GPSLatitude' 
          ? (value[0] >= 0 ? 'N' : 'S') 
          : (value[0] >= 0 ? 'E' : 'W');
        return `${Math.abs(value[0]).toFixed(6)}° ${direction}`;
      }
      return String(value);
    case 'GPSAltitude':
      return `${value}m`;
    default:
      return String(value);
  }
}

// Define interface for EXIF data item
interface ExifItem {
  photoId: string;
  exifData: Record<string, any>;
}

// Process EXIF data for display
function processExifData() {
  if (!selectedPhotosExif.value.length) {
    sections.value.forEach(section => {
      section.fields = [];
    });
    return;
  }
  
  // Get all unique EXIF keys from selected photos
  const allExifKeys = new Set<string>();
  selectedPhotosExif.value.forEach((item: ExifItem) => {
    if (item?.exifData) {
      Object.keys(item.exifData).forEach(key => allExifKeys.add(key));
    }
  });
  
  // Process each field
  const allFields: Record<string, ExifField> = {};
  
  allExifKeys.forEach(key => {
    // Get values for this field across all selected photos
    const photoValues: Record<string, any> = {};
    
    selectedPhotosExif.value.forEach((item: ExifItem) => {
      if (item?.exifData && item.exifData[key] !== undefined) {
        photoValues[item.photoId] = item.exifData[key];
      }
    });
    
    // Check if we have multiple different values
    const uniqueValues = new Set(Object.values(photoValues).map(v => JSON.stringify(v)));
    const isMultipleValues = uniqueValues.size > 1;
    
    // Get display value (first value or placeholder for multiple values)
    const firstValue = Object.values(photoValues)[0];
    const displayValue = isMultipleValues ? t('editor.multipleValues') : formatFieldValue(key, firstValue);
    
    // Create field object
    allFields[key] = {
      key,
      label: t(fieldLabels[key] || key),
      originalValues: photoValues,
      displayValue,
      isMultipleValues,
      editable: true,
      type: fieldTypes[key] || 'text',
      editValue: firstValue
    };
  });
  
  // Organize fields into sections
  const otherSectionIndex = sections.value.findIndex(s => s.title === 'editor.sections.other');
  
  // Reset all sections
  sections.value.forEach(section => {
    section.fields = [];
  });
  
  // Add fields to appropriate sections
  Object.values(allFields).forEach(field => {
    const sectionTitle = fieldCategories[field.key];
    const sectionIndex = sections.value.findIndex(s => s.title === sectionTitle);
    
    if (sectionIndex !== -1) {
      sections.value[sectionIndex].fields.push(field);
    } else {
      // Add to "Other" section if no category is defined
      sections.value[otherSectionIndex].fields.push(field);
    }
  });
  
  // Sort fields alphabetically within each section
  sections.value.forEach(section => {
    section.fields.sort((a, b) => a.label.localeCompare(b.label));
  });
}

// Handle editing a field
function startEditing(sectionIndex: number, fieldIndex: number) {
  const field = sections.value[sectionIndex].fields[fieldIndex];
  // Reset edit value to first valid value
  field.editValue = Object.values(field.originalValues)[0];
  
  // Set active section
  activeSection.value = `${sectionIndex}-${fieldIndex}`;
}

// Save edited field
function saveField(sectionIndex: number, fieldIndex: number) {
  const field = sections.value[sectionIndex].fields[fieldIndex];
  
  // Apply the new value to all selected photos
  selectedPhotos.value.forEach((photo: any) => {
    // Update exif store
    if (exifStore.value[photo.id]) {
      exifStore.value[photo.id] = {
        ...exifStore.value[photo.id],
        [field.key]: field.editValue
      };
    }
  });
  
  // Update field
  field.isMultipleValues = false;
  field.displayValue = formatFieldValue(field.key, field.editValue);
  Object.keys(field.originalValues).forEach(photoId => {
    field.originalValues[photoId] = field.editValue;
  });
  
  // Reset active section
  activeSection.value = null;
  
  ElMessage.success(t('editor.saveSuccess'));
}

// Cancel editing
function cancelEditing() {
  activeSection.value = null;
}

// Watch for changes in selected photos and update EXIF display
watch(selectedPhotosExif, () => {
  processExifData();
}, { immediate: true, deep: true });
</script>

<template>
  <div class="exif-editor-container">
    <div v-if="!hasSelectedPhotos" class="editor-placeholder">
      <p class="placeholder-text">{{ noDataMessage }}</p>
    </div>
    
    <template v-else>
      <!-- Editor header -->
      <div class="editor-header">
        <h2 class="editor-title">{{ t('editor.title') }}</h2>
        <div class="selection-info">
          {{ t('editor.selectedCount', { count: selectedPhotos.length }) }}
        </div>
      </div>
      
      <!-- EXIF content -->
      <div class="editor-content">
        <template v-for="(section, sectionIndex) in sections" :key="section.title">
          <div v-if="section.fields.length > 0" class="exif-section">
            <div class="section-header">
              <h3 class="section-title">{{ t(section.title) }}</h3>
            </div>
            
            <div class="section-content">
              <div 
                v-for="(field, fieldIndex) in section.fields" 
                :key="field.key"
                class="exif-field"
              >
                <!-- Field in view mode -->
                <template v-if="activeSection !== `${sectionIndex}-${fieldIndex}`">
                  <div class="field-label">{{ field.label }}</div>
                  <div class="field-value" :class="{ 'multiple-values': field.isMultipleValues }">
                    {{ field.displayValue }}
                  </div>
                  <div class="field-actions">
                    <el-button 
                      type="primary" 
                      size="small" 
                      circle 
                      @click="startEditing(sectionIndex, fieldIndex)"
                    >
                      <i class="el-icon-edit"></i>
                    </el-button>
                  </div>
                </template>
                
                <!-- Field in edit mode -->
                <template v-else>
                  <div class="field-label">{{ field.label }}</div>
                  <div class="field-edit">
                    <!-- Different input types based on field type -->
                    <el-input 
                      v-if="field.type === 'text'"
                      v-model="field.editValue" 
                      size="small"
                    ></el-input>
                    
                    <el-input-number 
                      v-else-if="field.type === 'number'"
                      v-model="field.editValue" 
                      :min="0"
                      :precision="field.key === 'ISO' ? 0 : 4"
                      :step="field.key === 'ISO' ? 100 : 0.1"
                      size="small"
                      style="width: 100%"
                    ></el-input-number>
                    
                    <el-date-picker
                      v-else-if="field.type === 'date'"
                      v-model="field.editValue"
                      type="datetime"
                      size="small"
                      style="width: 100%"
                    ></el-date-picker>
                    
                    <!-- For GPS coordinates -->
                    <div v-else-if="field.type === 'gps'" class="gps-inputs">
                      <el-input-number 
                        v-model="field.editValue[0]" 
                        :precision="6"
                        :step="0.000001"
                        size="small"
                        style="width: 100%"
                      ></el-input-number>
                    </div>
                  </div>
                  
                  <div class="edit-actions">
                    <el-button 
                      type="success" 
                      size="small" 
                      circle
                      @click="saveField(sectionIndex, fieldIndex)"
                    >
                      <i class="el-icon-check"></i>
                    </el-button>
                    <el-button 
                      type="danger" 
                      size="small" 
                      circle
                      @click="cancelEditing"
                    >
                      <i class="el-icon-close"></i>
                    </el-button>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/styles/abstracts' as *;

/* EXIF Editor container takes full height and width of parent */
.exif-editor-container {
  height: 100%;
  width: 100%;
  @include flex(column);
  align-items: normal;
  overflow: hidden;
  color: var(--text-primary);
}

/* Placeholder for editor content */
.editor-placeholder {
  flex: 1;
  @include flex(column, center, center);
  border-radius: $border-radius;
}

/* Placeholder text style */
.placeholder-text {
  color: var(--text-secondary);
  font-size: 1rem;
}

/* Editor header */
.editor-header {
  padding: $spacing-base;
  border-bottom: 1px solid var(--text-secondary);
  @include flex(row, space-between, center);
  
  .editor-title {
    font-size: 1.25rem;
    font-weight: 500;
    margin: 0;
  }
  
  .selection-info {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
}

/* Editor content with scrolling */
.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-base;
  
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
}

/* Section styling */
.exif-section {
  margin-bottom: $spacing-lg;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .section-header {
    margin-bottom: $spacing-sm;
    
    .section-title {
      font-size: 1rem;
      font-weight: 500;
      margin: 0;
      padding-bottom: $spacing-xs;
      border-bottom: 1px solid var(--text-secondary);
    }
  }
}

/* Field styling */
.exif-field {
  @include flex(row, space-between, center);
  padding: $spacing-xs 0;
  font-size: 0.875rem;
  
  &:not(:last-child) {
    border-bottom: 1px dashed rgba(var(--text-secondary-rgb), 0.3);
  }
  
  .field-label {
    width: 35%;
    font-weight: 500;
    @include truncate;
    text-transform: capitalize;
  }
  
  .field-value {
    width: 50%;
    @include truncate;
    
    &.multiple-values {
      font-style: italic;
      color: var(--text-secondary);
    }
  }
  
  .field-actions {
    width: 15%;
    text-align: right;
  }
  
  .field-edit {
    width: 50%;
  }
  
  .edit-actions {
    width: 15%;
    @include flex(row, flex-end, center, $spacing-xs);
  }
  
  .gps-inputs {
    @include flex(column, flex-start, stretch, $spacing-xs);
    width: 100%;
  }
}
</style> 