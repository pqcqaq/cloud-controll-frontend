<!-- 💥 这里是一次性加载 LayoutComponents -->
<template>
  <component :is="LayoutComponents[layout]" />
  <ThemeDrawer />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import ThemeDrawer from '@/layouts/components/ThemeDrawer/index.vue';
import LayoutVertical from '@/layouts/LayoutVertical/index.vue';
import LayoutClassic from '@/layouts/LayoutClassic/index.vue';
import LayoutTransverse from '@/layouts/LayoutTransverse/index.vue';
import LayoutColumns from '@/layouts/LayoutColumns/index.vue';
import { useAppStore } from '@/stores/modules/app';
import { useSocketStore } from '@/stores/modules/socket';
import { storeToRefs } from 'pinia';
import { useLoadingStore } from '@/stores/modules/loading';
import { ElLoading, ElMessage, ElNotification } from 'element-plus';
import mittBus from '@/utils/mittBus';

defineOptions({
  name: 'Layout'
});

const LayoutComponents = {
  vertical: LayoutVertical,
  classic: LayoutClassic,
  transverse: LayoutTransverse,
  columns: LayoutColumns
};

const appStore = useAppStore();
const layout = computed(() => appStore.layout);

const { loading } = storeToRefs(useLoadingStore());

const startLoadingTime = ref<number>(0);

watch(
  () => loading.value,
  () => {
    if (loading.value) {
      ElLoading.service({ fullscreen: true });
      startLoadingTime.value = Date.now();
    } else {
      // 要保证最小500ms的加载时间
      const now = Date.now();
      const diff = now - startLoadingTime.value;
      if (diff < 500) {
        setTimeout(() => {
          ElLoading.service().close();
        }, 500 - diff);
      } else {
        ElLoading.service().close();
      }
    }
  }
);
// 开启socket
const socketStore = useSocketStore();
socketStore.open();

onMounted(() => {
  mittBus.on('socket.PRINT_ERROR', (data: any) => {
    let printType = '';
    switch (data.type) {
      case 'SN':
        printType = 'SN码';
        break;
      case 'PRODUCT':
        printType = '产品标签';
        break;
      case 'MID_BOX':
        printType = '中箱标签';
        break;
      case 'PALLET':
        printType = '栈板标签';
        break;
      case 'DEST':
        printType = '目的地标签';
        break;
      default:
        break;
    }

    ElNotification({
      title: '打印失败',
      message: `打印${printType}失败，错误信息：${data.error}`,
      type: 'error'
    });
  });
});
</script>

<style scoped lang="scss">
.layout {
  min-width: 600px;
}
</style>
