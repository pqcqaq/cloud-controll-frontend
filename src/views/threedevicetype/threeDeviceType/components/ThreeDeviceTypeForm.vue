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
      <el-form-item label="类型名称" prop="name">
        <el-input v-model="paramsProps.row.name" placeholder="请填写类型名称" clearable></el-input>
      </el-form-item>
      <!-- 类别型号 -->
      <el-form-item label="类别型号" prop="model">
        <el-input v-model="paramsProps.row.model" placeholder="请填写类别型号" clearable></el-input>
      </el-form-item>
      <el-form-item label="图片文件" prop="imageId">
        <!-- <el-input
          v-model="paramsProps.row.imageId"
          placeholder="请填写图片文件ID"
          clearable
        ></el-input> -->
        <UploadFile
          v-model="paramsProps.row.imageId"
          type="product"
          tip="请上传图片文件"
          accept="image/*"
          :url="paramsProps.row.url"
        >
        </UploadFile>
      </el-form-item>
      <el-form-item label="高电平有效" prop="effectiveHighVoltage">
        <!-- <el-input-number
          v-model="paramsProps.row.effectiveHighVoltage" :precision="0" :min="1" :max="999999" 
          /> -->
        <el-switch v-model="paramsProps.row.effectiveHighVoltage" />
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
import UploadFile from '@/components/Upload/file.vue';

defineOptions({
  name: 'ThreeDeviceTypeForm'
});

const rules = reactive({
  delFlag: [{ required: true, message: '请填写删除与否' }],
  effectiveHighVoltage: [{ required: true, message: '请填写是否为高电平有效' }],
  name: [{ required: true, message: '请填写类型名称' }],
  imageId: [
    {
      required: true,
      message: '请上传一个图片'
    }
  ],
  model: [{ required: true, message: '请填写类别型号' }]
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
