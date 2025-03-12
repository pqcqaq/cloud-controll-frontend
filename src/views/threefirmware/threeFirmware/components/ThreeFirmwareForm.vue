<template>
  <el-dialog v-model="visible" :title="`${paramsProps.title}`" :destroy-on-close="true" width="580px" draggable>
    <el-form
      ref="ruleFormRef"
      label-width="140px"
      label-suffix=" :"
      :rules="rules"
      :model="paramsProps.row"
      @submit.enter.prevent="handleSubmit"
    >
      <el-form-item label="固件版本" prop="version">
        <el-input v-model="paramsProps.row.version" placeholder="请填写固件版本" clearable></el-input>
      </el-form-item>
      <el-form-item label="关联的文件id" prop="fileId">
        <!-- <el-input
          v-model="paramsProps.row.fileId"
          placeholder="请填写关联的文件id"
          clearable
        ></el-input> -->
        <FileUpload v-model="paramsProps.row.fileId"></FileUpload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false"> 取消</el-button>
      <el-button type="primary" @click="handleSubmit"> 确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { type ElForm, ElMessage } from 'element-plus';
import FileUpload from '@/components/Upload/firmware.vue';

defineOptions({
  name: 'ThreeFirmwareForm'
});

const rules = reactive({
  delFlag: [{ required: true, message: '请填写删除与否' }],
  version: [{ required: true, message: '请填写固件版本' }],
  fileId: [{ required: true, message: '请填写关联的文件id' }]
});

const visible = ref(false);
const paramsProps = ref<View.DefaultParams>({
  title: '',
  row: {},
  api: undefined,
  getTableList: undefined
});

// 接收父组件传过来的参数
const acceptParams = (params: View.DefaultParams) => {
  paramsProps.value = params;
  visible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await paramsProps.value.api!(paramsProps.value.row);
      ElMessage.success({ message: `${paramsProps.value.title}成功！` });
      paramsProps.value.getTableList!();
      visible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>

<style scoped lang="scss"></style>
