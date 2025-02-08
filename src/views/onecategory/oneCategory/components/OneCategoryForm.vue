<template>
  <el-dialog
    v-model="visible"
    :title="`${paramsProps.title}`"
    :destroy-on-close="true"
    width="580px"
    draggable
  >
    <el-form
      ref="ruleFormRef"
      label-width="140px"
      label-suffix=" :"
      :rules="rules"
      :model="paramsProps.row"
      @submit.enter.prevent="handleSubmit"
    >
      <el-form-item
        label="SKU"
        prop="sku"
      >
        <el-input
          v-model="paramsProps.row.sku"
          placeholder="请填写SKU"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="产品ID标识"
        prop="idCode"
      >
        <el-input-number
          v-model="paramsProps.row.idCode"
          :precision="0"
          :min="1"
          :max="999999"
        />
      </el-form-item>
      <el-form-item
        label="产品名称"
        prop="name"
      >
        <el-input
          v-model="paramsProps.row.name"
          placeholder="请填写产品名称"
          clearable
        />
      </el-form-item>
      <!-- 最大重量和最小重量 -->
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="最小重量"
            prop="minWeight"
          >
            <el-input-number
              v-model="paramsProps.row.minWeight"
              :precision="2"
              :min="0"
              :max="999999"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="最大重量"
            prop="maxWeight"
          >
            <el-input-number
              v-model="paramsProps.row.maxWeight"
              :precision="2"
              :min="0"
              :max="999999"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">
        取消
      </el-button>
      <el-button
        type="primary"
        @click="handleSubmit"
      >
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { type ElForm, ElMessage } from 'element-plus';

defineOptions({
  name: 'OneCategoryForm'
});

const rules = reactive({
  sku: [{ required: true, message: '请填写SKU' }],
  idCode: [{ required: true, message: '请填写产品ID标识' }],
  name: [{ required: true, message: '请填写产品名称' }],
  delFlag: [{ required: true, message: '请填写删除与否' }]
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
