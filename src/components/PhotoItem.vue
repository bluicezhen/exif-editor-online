<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'

// Define props for the component
interface PhotoItemProps {
  id: string
  url: string
  name: string
  selected: boolean
}

const props = defineProps<PhotoItemProps>()

// Define events to communicate with parent
const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'update:selected', value: boolean): void
}>()

// Handle click on the photo item
function handleClick() {
  emit('select', props.id)
}

// Create computed property for checkbox binding
const isSelected = computed({
  get: () => props.selected,
  set: (value) => {
    emit('update:selected', value)
  }
})
</script>

<template>
  <div 
    class="photo-item aspect-square bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow relative cursor-pointer"
    :class="{ 'photo-selected': selected }"
    @click="handleClick"
  >
    <div class="checkbox-container absolute top-2 left-2 z-10" @click.stop>
      <el-checkbox v-model="isSelected" />
    </div>
    <div class="w-full h-full flex items-center justify-center">
      <img 
        :src="url" 
        :alt="name"
        class="max-w-full max-h-full object-contain" 
      />
    </div>
    <div class="photo-name absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
      {{ name }}
    </div>
  </div>
</template>

<style scoped>
.photo-item {
  transition: all 0.2s ease;
  margin-bottom: 0;
}

.photo-selected {
  outline: 2px solid #409eff;
  transform: scale(1.02);
  z-index: 1;
}

.photo-name {
  bottom: 0;
  margin: 0;
}
</style> 