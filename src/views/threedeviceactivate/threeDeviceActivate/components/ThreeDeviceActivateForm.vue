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
      <el-form-item label="唯一标识" prop="imei">
        <el-input v-model="paramsProps.row.imei" placeholder="请填写唯一标识" clearable></el-input>
      </el-form-item>
      <el-form-item label="设备类型" prop="deviceTypeId">
        <el-select v-model="paramsProps.row.deviceTypeId" clearable placeholder="请选择设备类型">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="`${item.name}/${item.enableHighVoltage ? 'high' : 'low'}`"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false"> 取消</el-button>
      <el-button type="primary" @click="handleSubmit"> 确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { type ElForm, ElMessage } from 'element-plus';
import { useOptionsStore } from '@/stores/modules/options';
import { getThreeDeviceTypeOptionsApi } from '@/api/modules/threedevicetype/threeDeviceType';
import type { IThreeDeviceType } from '@/api/interface/threedevicetype/threeDeviceType';

defineOptions({
  name: 'ThreeDeviceActivateForm'
});

const options = ref<IThreeDeviceType.Options[]>([]);

const getOptionsList = () => {
  getThreeDeviceTypeOptionsApi().then(res => {
    options.value = res.data;
  });
};

onMounted(() => {
  getOptionsList();
});

const optionsStore = useOptionsStore();
const rules = reactive({
  delFlag: [{ required: true, message: '请填写删除与否' }],
  imei: [{ required: true, message: '请填写唯一标识' }],
  deviceTypeId: [{ required: true, message: '请填写设备类型' }]
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
