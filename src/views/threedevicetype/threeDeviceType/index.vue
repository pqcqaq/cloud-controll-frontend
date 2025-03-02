<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="设备类型管理"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
      row-key="id"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" v-auth="'three.device.type.create'" :icon="CirclePlus" @click="openAddEdit('新增设备类型管理')">
          新增
        </el-button>
        <el-button
          v-auth="'three.device.type.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
        <el-button v-auth="'three.device.type.import'" type="primary" :icon="Upload" plain @click="importData"> 导入 </el-button>
        <el-button v-auth="'three.device.type.export'" type="primary" :icon="Download" plain @click="downloadFile">
          导出
        </el-button>
      </template>
      <template #operation="{ row }">
        <el-button
          v-auth="'three.device.type.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑设备类型管理', row, false)"
        >
          编辑
        </el-button>
        <el-button v-auth="'three.device.type.remove'" type="primary" link :icon="Delete" @click="deleteInfo(row)">
          删除
        </el-button>
      </template>
    </ProTable>
    <ThreeDeviceTypeForm ref="threeDeviceTypeRef" />
    <ImportExcel ref="ImportExcelRef" />
  </div>
</template>

<script setup lang="ts">
import { h, ref } from 'vue';
import { CirclePlus, Delete, EditPen, Upload, Download } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import {
  createThreeDeviceTypeApi,
  removeThreeDeviceTypeApi,
  updateThreeDeviceTypeApi,
  getThreeDeviceTypeListApi,
  getThreeDeviceTypeDetailApi,
  importThreeDeviceTypeExcelApi,
  exportThreeDeviceTypeExcelApi
} from '@/api/modules/threedevicetype/threeDeviceType';
import { useHandleData } from '@/hooks/useHandleData';
import ThreeDeviceTypeForm from '@/views/threedevicetype/threeDeviceType/components/ThreeDeviceTypeForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IThreeDeviceType } from '@/api/interface/threedevicetype/threeDeviceType';
import ImportExcel from '@/components/ImportExcel/index.vue';
import { downloadTemplate } from '@/api/modules/system/common';
import { ElMessageBox, ElTag } from 'element-plus';
import { useDownload } from '@/hooks/useDownload';
defineOptions({
  name: 'ThreeDeviceTypeView'
});
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IThreeDeviceType.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'name', label: '类型名称' },
  {
    prop: 'effectiveHighVoltage',
    label: '是否为高电平有效',
    render: ({ row }) => {
      return h(ElTag, { type: row.effectiveHighVoltage ? 'success' : 'danger' }, row.effectiveHighVoltage ? '是' : '否');
    }
  },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
];
// 搜索条件项
const searchColumns: SearchProps[] = [
  { prop: 'effectiveHighVoltage', label: '是否为高电平有效', el: 'switch' },
  { prop: 'name', label: '类型名称', el: 'input' }
];
// 获取table列表
const getTableList = (params: IThreeDeviceType.Query) => {
  let newParams = formatParams(params);
  return getThreeDeviceTypeListApi(newParams);
};
const formatParams = (params: IThreeDeviceType.Query) => {
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
const threeDeviceTypeRef = ref<InstanceType<typeof ThreeDeviceTypeForm>>();
const openAddEdit = async (title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getThreeDeviceTypeDetailApi({ id: row?.id });
    row = record?.data;
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createThreeDeviceTypeApi : updateThreeDeviceTypeApi,
    getTableList: proTableRef.value?.getTableList
  };
  threeDeviceTypeRef.value?.acceptParams(params);
};
// 删除信息
const deleteInfo = async (params: IThreeDeviceType.Row) => {
  await useHandleData(removeThreeDeviceTypeApi, { ids: [params.id] }, `删除【${params.id}】设备类型管理`);
  proTableRef.value?.getTableList();
};
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeThreeDeviceTypeApi, { ids }, '删除所选设备类型管理');
  proTableRef.value?.clearSelection();
  proTableRef.value?.getTableList();
};
// 导入
const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>();
const importData = () => {
  const params = {
    title: '设备类型管理',
    templateName: '设备类型管理',
    tempApi: downloadTemplate,
    importApi: importThreeDeviceTypeExcelApi,
    getTableList: proTableRef.value?.getTableList
  };
  ImportExcelRef.value?.acceptParams(params);
};
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as IThreeDeviceType.Query);
  useDownload(exportThreeDeviceTypeExcelApi, '设备类型管理', newParams);
};
</script>
