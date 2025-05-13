<script setup lang="ts">
import { watch } from 'vue'
import { usePreferredDark, useStorage } from '@vueuse/core'
import { ElSwitch } from 'element-plus'
import { Moon, Sunny } from '@element-plus/icons-vue'

const isDark = useStorage('exif-editor-theme-dark', false)
const prefersDark = usePreferredDark()

// 初始化时，如果用户偏好暗色模式且没有保存的主题设置，则使用暗色模式
if (prefersDark.value && isDark.value === false && localStorage.getItem('exif-editor-theme-dark') === null) {
  isDark.value = true
}

// 监听暗黑模式变化，更新文档类名
watch(
  isDark,
  (dark) => {
    if (dark) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="theme-switcher">
    <ElSwitch
      v-model="isDark"
      :active-icon="Moon"
      :inactive-icon="Sunny"
      inline-prompt
      class="theme-switch"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/styles/abstracts' as *;

.theme-switcher {
  @include flex(row, center, center);
  margin-left: $spacing-sm;

  .theme-switch {
    --el-switch-on-color: #409eff;
  }
}
</style> 