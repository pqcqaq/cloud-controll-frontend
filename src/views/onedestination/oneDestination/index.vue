<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="目的地信息"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
      row-key="id"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button
          type="primary"
          v-auth="'one.destination.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增目的地信息')"
        >
          新增
        </el-button>
        <el-button
          v-auth="'one.destination.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
        <el-button
          v-auth="'one.destination.import'"
          type="primary"
          :icon="Upload"
          plain
          @click="importData"
        >
          导入
        </el-button>
        <el-button
          v-auth="'one.destination.export'"
          type="primary"
          :icon="Download"
          plain
          @click="downloadFile"
        >
          导出
        </el-button>
      </template>
      <template #operation="{ row }">
        <el-button
          v-auth="'one.destination.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑目的地信息', row, false)"
        >
          编辑
        </el-button>
        <el-button
          v-auth="'one.destination.remove'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <OneDestinationForm ref="oneDestinationRef" />
    <ImportExcel ref="ImportExcelRef" />
  </div>
</template>

<script setup lang="ts">
import { h, ref } from 'vue';
import { CirclePlus, Delete, EditPen, Upload, Download } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import {
  createOneDestinationApi,
  removeOneDestinationApi,
  updateOneDestinationApi,
  getOneDestinationListApi,
  getOneDestinationDetailApi,
  importOneDestinationExcelApi,
  exportOneDestinationExcelApi
} from '@/api/modules/onedestination/oneDestination';
import { useHandleData } from '@/hooks/useHandleData';
import OneDestinationForm from '@/views/onedestination/oneDestination/components/OneDestinationForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IOneDestination } from '@/api/interface/onedestination/oneDestination';
import ImportExcel from '@/components/ImportExcel/index.vue';
import { downloadTemplate } from '@/api/modules/system/common';
import { useDownload } from '@/hooks/useDownload';
import { ElTag } from 'element-plus';
defineOptions({
  name: 'OneDestinationView'
});
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IOneDestination.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'address', label: '实际地址' },
  {
    prop: 'enable',
    label: '是否启用',
    render: ({ row }) =>
      row.enable
        ? 
          h(ElTag, { type: 'success' }, ["是"])
        : h(ElTag, { type: 'danger' }, ["否"])
  },
  { prop: 'label', label: '显示名称' },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
];
// 搜索条件项
const searchColumns: SearchProps[] = [
  { prop: 'address', label: '实际地址', el: 'input' },
  { prop: 'enable', label: '是否启用', el: 'input' },
  { prop: 'label', label: '显示名称', el: 'input' }
];
// 获取table列表
const getTableList = (params: IOneDestination.Query) => {
  let newParams = formatParams(params);
  return getOneDestinationListApi(newParams);
};
const formatParams = (params: IOneDestination.Query) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.createTimeStart = newParams.createTime[0]);
  newParams.createTime && (newParams.createTimeEnd = newParams.createTime[1]);
  delete newParams.createTime;
  newParams.updateTime && (newParams.updateTimeStart = newParams.updateTime[0]);
  newParams.updateTime && (newParams.updateTimeEnd = newParams.updateTime[1]);
  delete newParams.updateTime;
  return newParams;
};
// 打开 drawer(新增、查看、编辑)
const oneDestinationRef = ref<InstanceType<typeof OneDestinationForm>>();
const openAddEdit = async (title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getOneDestinationDetailApi({ id: row?.id });
    row = record?.data;
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createOneDestinationApi : updateOneDestinationApi,
    getTableList: proTableRef.value?.getTableList
  };
  oneDestinationRef.value?.acceptParams(params);
};
// 删除信息
const deleteInfo = async (params: IOneDestination.Row) => {
  await useHandleData(removeOneDestinationApi, { ids: [params.id] }, `删除【${params.id}】目的地信息`);
  proTableRef.value?.getTableList();
};
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeOneDestinationApi, { ids }, '删除所选目的地信息');
  proTableRef.value?.clearSelection();
  proTableRef.value?.getTableList();
};
// 导入
const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>();
const importData = () => {
  const params = {
    title: '目的地信息',
    templateName: '目的地信息',
    tempApi: downloadTemplate,
    importApi: importOneDestinationExcelApi,
    getTableList: proTableRef.value?.getTableList
  };
  ImportExcelRef.value?.acceptParams(params);
};
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as IOneDestination.Query);
  useDownload(exportOneDestinationExcelApi, '目的地信息', newParams);
};
</script>
