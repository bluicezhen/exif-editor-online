<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

const { locale } = useI18n()

const languages = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' }
]

const currentLanguage = computed(() => {
  return languages.find(lang => lang.value === locale.value) || languages[0]
})

function handleLanguageChange(lang: string) {
  locale.value = lang
}
</script>

<template>
  <div class="language-switcher">
    <el-dropdown @command="handleLanguageChange" trigger="click">
      <span class="el-dropdown-link">
        {{ currentLanguage.label }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in languages"
            :key="item.value"
            :command="item.value"
            :class="{ active: currentLanguage.value === item.value }"
          >
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/styles/abstracts' as *;

.language-switcher {
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  cursor: pointer;
  color: var(--header-text);
  transition: all 0.2s;
  font-size: 0.875rem;
  
  &:hover {
    opacity: 0.8;
  }
}

:deep(.el-dropdown-menu__item) {
  &.active {
    color: var(--el-color-primary);
    background-color: var(--el-dropdown-menuItem-hover-fill);
  }
}
</style> 