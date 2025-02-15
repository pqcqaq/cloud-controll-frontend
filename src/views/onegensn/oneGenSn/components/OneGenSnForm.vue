<template>
  <el-dialog
    v-model="visible"
    :title="`${paramsProps.title}`"
    :destroy-on-close="true"
    width="500px"
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
      <el-row>
        <el-form-item
          label="生产类别"
          prop="categoryId"
        >
          <el-select
            v-model="paramsProps.row.categoryId"
            placeholder="请选择生产类别"
            clearable
            class="selections"
          >
            <el-option
              v-for="item in categorySelections"
              :key="item.id"
              :label="item.idCode + '/' + item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- 产线 -->
        <el-form-item
          label="产线"
          prop="assemblyLineId"
        >
          <el-select
            v-model="paramsProps.row.assemblyLineId"
            placeholder="请选择产线"
            clearable
            class="selections"
          >
            <el-option
              v-for="item in assemblySelections"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-row>
      <!-- 生成数量num -->
      <el-form-item
        label="生成数量"
        prop="num"
      >
        <el-input-number
          v-model="paramsProps.row.num"
          :precision="0"
          :min="1"
          :max="999999"
        />
      </el-form-item>
      <!-- <el-form-item label="生成的SN" prop="code">
        <el-input
          v-model="paramsProps.row.code"
          placeholder="请填写生成的SN"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="自增号" prop="seq">
        <el-input-number
          v-model="paramsProps.row.seq" :precision="0" :min="1" :max="999999" />
      </el-form-item>
      <el-form-item label="是否已经使用" prop="used">
        <el-input-number
          v-model="paramsProps.row.used" :precision="0" :min="1" :max="999999" />
      </el-form-item> -->
      <el-form-item
        label="生产日期"
        prop="produceTime"
      >
        <!-- 只能选择日期 -->
        <el-date-picker
          clearable
          v-model="paramsProps.row.produceTime"
          type="date"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择生产日期"
        />
      </el-form-item>
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
import { ref, reactive, onMounted, watchEffect, watch } from 'vue';
import { dayjs, type ElForm, ElMessage } from 'element-plus';
import type { IOneCategory } from '@/api/interface/onecategory/assembly';
import { listCategoryLabelApi } from '@/api/modules/onecategory/assembly';
import type { IOneAssemblyLine } from '@/api/interface/oneassemblyline/oneAssemblyLine';
import { getOneAssemblyLineSelectionApi } from '@/api/modules/oneassemblyline/oneAssemblyLine';
const categorySelections = ref<IOneCategory.CategoryLabelVo[]>([]);
const assemblySelections = ref<IOneAssemblyLine.Selection[]>([]);
onMounted(() => {
  listCategoryLabelApi({
    needSn: true
  }).then(res => {
    categorySelections.value = res.data;
  });
  // getOneAssemblyLineSelectionApi({
  //   categoryId: paramsProps.value.row.categoryId
  // }).then(res => {
  //   assemblySelections.value = res.data;
  // });
});
defineOptions({
  name: 'OneGenSnForm'
});

const rules = reactive({
  // delFlag: [{ required: true, message: '请填写删除与否' }],
  categoryId: [{ required: true, message: '请填写类别ID' }],
  // code: [{ required: true, message: '请填写生成的SN' }],
  // seq: [{ required: true, message: '请填写自增号' }],
  // used: [{ required: true, message: '请填写是否已经使用' }],
  assemblyLineId: [{ required: true, message: '请填写产线' }],
  num: [{ required: true, message: '请填写生成数量' }],
  produceTime: [{ required: true, message: '请填写生产日期' }]
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
      await paramsProps.value.api!({
        ...paramsProps.value.row,
        produceTime: dayjs(paramsProps.value.row.produceTime).format('YYYY-MM-DD HH:mm:ss')
      });
      ElMessage.success({ message: `${paramsProps.value.title}成功！` });
      paramsProps.value.getTableList!();
      visible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

// 在visiable设置为true的时候，如果日期为空则显示为今天，如果数量为空则显示 1
onMounted(() => {
  if (visible.value) {
    if (!paramsProps.value.row.produceTime) {
      paramsProps.value.row.produceTime = dayjs();
    }
    if (!paramsProps.value.row.num) {
      paramsProps.value.row.num = 10;
    }
  }
});

watchEffect(() => {
  if (visible.value) {
    if (!paramsProps.value.row.produceTime) {
      paramsProps.value.row.produceTime = dayjs();
    }
    if (!paramsProps.value.row.num) {
      paramsProps.value.row.num = 10;
    }
  }
});

// 当categorySelection改变时，重新获取assemblySelection
watch(
  () => paramsProps.value.row.categoryId,
  () => {
    // 清空assemblyId
    paramsProps.value.row.assemblyLineId = '';
    getOneAssemblyLineSelectionApi({
      categoryId: paramsProps.value.row.categoryId
    }).then(res => {
      assemblySelections.value = res.data;
    });
  }
);

defineExpose({
  acceptParams
});
</script>

<style scoped lang="scss">
.selections {
  width: 200px;
}
</style>
