import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLoadingStore = defineStore('loading', () => {
  const loading = ref(false);

  const showFullScreenLoading = () => {
    loading.value = true;
  };
  const hideFullScreenLoading = () => {
    loading.value = false;
  };
  return {
    loading,
    showFullScreenLoading,
    hideFullScreenLoading
  };
});
