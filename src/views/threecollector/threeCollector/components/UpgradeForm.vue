<template>
  <el-dialog v-model="visible" title="更新采集器" :destroy-on-close="true" width="580px" draggable>
    <!-- 填写版本号的表单 -->
    <el-form ref="formRef" :model="form" label-width="auto">
      <el-input v-model="form.version" placeholder="请输入版本号"></el-input>
    </el-form>
    <template #footer>
      <el-button @click="visible = false"> 取消</el-button>
      <el-button type="primary" @click="handleSubmit"> 确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { sendUpgradeMsgApi } from '@/api/modules/threecollector/threeCollector';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';

const visible = ref(false);
const collectorId = ref('');
const form = ref({
  version: ''
});

const open = (row: { id: number }) => {
  visible.value = true;
  collectorId.value = `${row.id}`;
};

const handleSubmit = () => {
  sendUpgradeMsgApi({
    collectorId: +collectorId.value,
    version: form.value.version
  }).then(() => {
    ElMessage.success('发送成功');
    visible.value = false;
  });
};

defineExpose({
  open
});
</script>

<style scoped></style>
