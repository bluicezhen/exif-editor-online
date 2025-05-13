<script setup lang="ts">
import { computed } from 'vue'

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
    class="photo-item"
    :class="{ 'photo-selected': selected }"
    @click="handleClick"
  >
    <div class="checkbox-container" @click.stop>
      <el-checkbox v-model="isSelected" />
    </div>
    <img 
      :src="url" 
      :alt="name"
      class="photo-image" 
    />
    <div class="photo-name">
      {{ name }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/styles/abstracts' as *;

.photo-item {
  position: relative;
  aspect-ratio: 1 / 1;
  background-color: var(--bg-primary);
  border-radius: $border-radius;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  }
}

.checkbox-container {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 10;
}

.photo-image {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Changed from cover back to contain to show full image */
}

.photo-selected {
  outline: 2px solid #409eff;
  transform: scale(1.02);
  z-index: 1;
}

.photo-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0,0,0,0.5);
  color: white;
  font-size: 0.75rem;
  padding: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style> 