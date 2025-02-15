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
        label="产线名称"
        prop="name"
      >
        <el-input
          v-model="paramsProps.row.name"
          placeholder="请填写产线名称"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="生产类别"
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
        label="生产线别"
        prop="lineType"
      >
        <el-input
          v-model="paramsProps.row.lineType"
          placeholder="请填写生产线别"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="模板文件夹"
        prop="templateDir"
      >
        <el-input
          v-model="paramsProps.row.templateDir"
          placeholder="请填写模板文件夹"
          clearable
        />
      </el-form-item>
    </el-form>
    <el-form-item label="模板文件结构">
      <el-tree
        v-if="fileInfos"
        :data="treeData"
        :props="defaultProps"
        node-key="filename"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span v-if="data.fileSize">
              ({{ data.fileSize }})
            </span>
          </span>
        </template>
      </el-tree>
    </el-form-item>
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
import { ref, reactive, watch, computed } from 'vue';
import { type ElForm, ElMessage } from 'element-plus';
import type { IOneAssemblyLine } from '@/api/interface/oneassemblyline/oneAssemblyLine';
import { getTemplateFileInfoApi } from '@/api/modules/oneassemblyline/oneAssemblyLine';

defineOptions({
  name: 'OneAssemblyLineForm'
});

const rules = reactive({
  name: [{ required: true, message: '请填写产线名称' }],
  idCode: [{ required: true, message: '请填写生产类别' }],
  lineType: [{ required: true, message: '请填写生产线别' }],
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

const fileInfos = ref<IOneAssemblyLine.TemplateFileInfo | null>(null);
watch(
  () => visible.value,
  () => {
    if (visible.value && paramsProps.value.row.id) {
      getTemplateFileInfoApi({
        id: paramsProps.value.row.id
      }).then(res => {
        fileInfos.value = res.data;
      });
    }
  }
);

// 计算属性：转换数据结构
const treeData = computed(() => {
  if (!fileInfos.value) return []

  const convertToTreeNode = (node: IOneAssemblyLine.TemplateFileInfo, parentId: string = '0'): any => {
    const id = `${parentId}-${node.filename}`
    return {
      id,
      label: node.filename,
      fileSize: node.fileSize,
      children: node.children?.map(child => convertToTreeNode(child, id)) || []
    }
  }

  return [convertToTreeNode(fileInfos.value)]
})
</script>

<style scoped lang="scss">

</style>
