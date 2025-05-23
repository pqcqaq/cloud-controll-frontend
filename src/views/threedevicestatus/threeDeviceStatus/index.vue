<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="设备状态"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
      row-key="id"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <!-- <el-button type="primary" v-auth="'three.device.status.create'" :icon="CirclePlus" @click="openAddEdit('新增设备状态')">
          新增
        </el-button>
        <el-button
          v-auth="'three.device.status.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
        <el-button v-auth="'three.device.status.import'" type="primary" :icon="Upload" plain @click="importData">
          导入
        </el-button> -->
        <el-button v-auth="'three.device.status.export'" type="primary" :icon="Download" plain @click="downloadFile">
          导出
        </el-button>
      </template>
      <template #operation="{ row }">
        <el-button
          v-auth="'three.device.status.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑设备状态', row, false)"
        >
          编辑
        </el-button>
        <el-button v-auth="'three.device.status.remove'" type="primary" link :icon="Delete" @click="deleteInfo(row)">
          删除
        </el-button>
      </template>
    </ProTable>
    <ThreeDeviceStatusForm ref="threeDeviceStatusRef" />
    <ImportExcel ref="ImportExcelRef" />
  </div>
</template>

<script setup lang="ts">
import { h, ref } from 'vue';
import { CirclePlus, Delete, EditPen, Upload, Download } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import {
  createThreeDeviceStatusApi,
  removeThreeDeviceStatusApi,
  updateThreeDeviceStatusApi,
  getThreeDeviceStatusListApi,
  getThreeDeviceStatusDetailApi,
  importThreeDeviceStatusExcelApi,
  exportThreeDeviceStatusExcelApi
} from '@/api/modules/threedevicestatus/threeDeviceStatus';
import { useHandleData } from '@/hooks/useHandleData';
import ThreeDeviceStatusForm from '@/views/threedevicestatus/threeDeviceStatus/components/ThreeDeviceStatusForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IThreeDeviceStatus } from '@/api/interface/threedevicestatus/threeDeviceStatus';
import ImportExcel from '@/components/ImportExcel/index.vue';
import { downloadTemplate } from '@/api/modules/system/common';
import { ElMessageBox, ElTag } from 'element-plus';
import { useDownload } from '@/hooks/useDownload';
defineOptions({
  name: 'ThreeDeviceStatusView'
});
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IThreeDeviceStatus.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'collectorId', label: '采集器ID' },
  { prop: 'signalStrength', label: '信号强度' },
  { prop: 'voltage', label: '采集器电压' },
  { prop: 'temperature', label: '温度' },
  { prop: 'uptime', label: '本次在线时间' },
  { prop: 'posLat', label: '纬度' },
  { prop: 'posLon', label: '经度' },
  {
    prop: 'isOnline',
    label: '是否在线',
    render: ({ row }) => {
      return h(ElTag, { type: row.isOnline ? 'success' : 'danger' }, row.isOnline ? '在线' : '离线');
    }
  },
  // { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
];
// 搜索条件项
const searchColumns: SearchProps[] = [{ prop: 'collectorId', label: '采集器ID', el: 'input' }];
// 获取table列表
const getTableList = (params: IThreeDeviceStatus.Query) => {
  let newParams = formatParams(params);
  return getThreeDeviceStatusListApi(newParams);
};
const formatParams = (params: IThreeDeviceStatus.Query) => {
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
const threeDeviceStatusRef = ref<InstanceType<typeof ThreeDeviceStatusForm>>();
const openAddEdit = async (title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getThreeDeviceStatusDetailApi({ id: row?.id });
    row = record?.data;
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createThreeDeviceStatusApi : updateThreeDeviceStatusApi,
    getTableList: proTableRef.value?.getTableList
  };
  threeDeviceStatusRef.value?.acceptParams(params);
};
// 删除信息
const deleteInfo = async (params: IThreeDeviceStatus.Row) => {
  await useHandleData(removeThreeDeviceStatusApi, { ids: [params.id] }, `删除【${params.id}】设备状态`);
  proTableRef.value?.getTableList();
};
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeThreeDeviceStatusApi, { ids }, '删除所选设备状态');
  proTableRef.value?.clearSelection();
  proTableRef.value?.getTableList();
};
// 导入
const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>();
const importData = () => {
  const params = {
    title: '设备状态',
    templateName: '设备状态',
    tempApi: downloadTemplate,
    importApi: importThreeDeviceStatusExcelApi,
    getTableList: proTableRef.value?.getTableList
  };
  ImportExcelRef.value?.acceptParams(params);
};
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as IThreeDeviceStatus.Query);
  useDownload(exportThreeDeviceStatusExcelApi, '设备状态', newParams);
};
</script>
