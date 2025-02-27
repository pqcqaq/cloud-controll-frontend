<template>
  <el-dialog
    v-model="visible"
    :title="`${paramsProps.title}`"
    :destroy-on-close="true"
    width="800px"
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
        label="产品名称"
        prop="name"
      >
        <el-input
          v-model="paramsProps.row.name"
          placeholder="请填写产品名称"
          clearable
        />
      </el-form-item>
      <el-row>
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
          label="销售码"
          prop="salesCode"
        >
          <el-input
            v-model="paramsProps.row.salesCode"
            placeholder="请填写销售码"
            clearable
          />
        </el-form-item>
      </el-row>
      
      <el-row>
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
        <!-- 颜色 -->
        <el-form-item
          label="颜色"
          prop="color"
        >
          <el-input
            v-model="paramsProps.row.color"
            placeholder="请填写颜色"
            clearable
          />
        </el-form-item>
      </el-row>
      
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
      <el-row>
        <el-form-item
          label="中箱内产品数量"
          prop="midBoxNum"
        >
          <el-input-number
            v-model="paramsProps.row.midBoxNum"
            :precision="0"
            :min="0"
            :max="999999"
          />
        </el-form-item>
        <el-form-item
          label="栈板内中箱数量"
          prop="palletNum"
        >
          <el-input-number
            v-model="paramsProps.row.palletNum"
            :precision="0"
            :min="0"
            :max="999999"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item
          label="是否需要SN"
          prop="needSn"
        >
          <el-switch v-model="paramsProps.row.needSn" />
        </el-form-item>
        <el-form-item
          label="是否称重"
          prop="needWeigh"
        >
          <el-switch v-model="paramsProps.row.needWeigh" />
        </el-form-item>
        <el-form-item
          label="是否需要中箱"
          prop="needMidBox"
        >
          <el-switch v-model="paramsProps.row.needMidBox" />
        </el-form-item>
        <el-form-item
          label="是否比对"
          prop="needScanCheck"
        >
          <el-switch v-model="paramsProps.row.needScanCheck" />
        </el-form-item>
        <el-form-item
          label="是否需要栈板"
          prop="needPallet"
        >
          <el-switch v-model="paramsProps.row.needPallet" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item
          label="SN模板"
          prop="snTemplateName"
        >
          <el-input
            v-model="paramsProps.row.snTemplateName"
            placeholder="请填写SN模板"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="产品模板"
          prop="productTemplateName"
        >
          <el-input
            v-model="paramsProps.row.productTemplateName"
            placeholder="请填写产品模板"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="中箱模板"
          prop="midBoxTemplateName"
        >
          <el-input
            v-model="paramsProps.row.midBoxTemplateName"
            placeholder="请填写中箱模板"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="栈板模板"
          prop="palletTemplateName"
        >
          <el-input
            v-model="paramsProps.row.palletTemplateName"
            placeholder="请填写栈板模板"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="目的地模板"
          prop="destTemplateName"
        >
          <el-input
            v-model="paramsProps.row.destTemplateName"
            placeholder="请填写目的地模板"
            clearable
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item
          label="包装规格"
          prop="packingSpec"
        >
          <el-input
            v-model="paramsProps.row.packingSpec"
            placeholder="请填写包装规格"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="毛重"
          prop="grossWeight"
        >
          <el-input
            v-model="paramsProps.row.grossWeight"
            placeholder="请填写毛重"
            clearable
          />
        </el-form-item>
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
  color: [{ required: true, message: '请填写颜色' }],
  minWeight: [{ required: true, message: '请填写最小重量' }],
  maxWeight: [{ required: true, message: '请填写最大重量' }],
  salesCode: [{ required: true, message: '请填写销售码' }],
  delFlag: [{ required: true, message: '请填写删除与否' }],
  midBoxNum: [{ required: true, message: '请填写中箱内产品数量' }],
  palletNum: [{ required: true, message: '请填写栈板内中箱数量' }],
  needSn: [{ required: true, message: '请填写是否需要SN' }],
  needWeigh: [{ required: true, message: '请填写是否称重' }],
  needMidBox: [{ required: true, message: '请填写是否需要中箱' }],
  needScanCheck: [{ required: true, message: '请填写是否需要扫描比对' }],
  needPallet: [{ required: true, message: '请填写是否需要栈板' }],
  midBoxTemplateName: [{ required: true, message: '请填写中箱模板文件名' }],
  palletTemplateName: [{ required: true, message: '请填写栈板模板文件名' }],
  productTemplateName: [{ required: true, message: '请填写产品模板文件名' }],
  snTemplateName: [{ required: true, message: '请填写SN模板文件名' }],
  destTemplateName: [{ required: true, message: '请填写目的地模板文件名' }],
  packingSpec: [{ required: true, message: '请填写包装规格' }],
  grossWeight: [{ required: true, message: '请填写毛重' }]
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
