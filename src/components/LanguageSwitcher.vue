<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElSelect, ElOption } from 'element-plus'

const { locale } = useI18n()

const languages = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' }
]

const currentLanguage = computed({
  get: () => locale.value,
  set: (value: string) => {
    locale.value = value
  }
})
</script>

<template>
  <div class="language-switcher">
    <el-select
      v-model="currentLanguage"
      class="w-24 language-select"
      size="small"
    >
      <el-option
        v-for="item in languages"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<style scoped>
.language-switcher {
  display: flex;
  align-items: center;
}

.language-select :deep(.el-input__wrapper) {
  /* background-color: transparent; */
  box-shadow: none;
}

.language-select :deep(.el-input__inner) {
  color: #f0f0f0;
}
</style> 