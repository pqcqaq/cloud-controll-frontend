<template>
  <div class="footer flx-center">
    云控后台 v{{ version }} | Copyright © 2022-{{ new Date().getFullYear() }} 内部系统
  </div>
</template>
<script setup lang="ts">
import pkg from 'package.json';
const version: string = pkg.version;
</script>
<style scoped lang="scss">
@import './index.scss';
</style>
