<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="引脚状态"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
      row-key="id"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary"
          v-auth="'three.pin.status.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增引脚状态')"
        >
          新增
        </el-button>
        <el-button
          v-auth="'three.pin.status.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
        <el-button
          v-auth="'three.pin.status.import'"
          type="primary"
          :icon="Upload"
          plain
          @click="importData"
        >
          导入
        </el-button>
        <el-button
          v-auth="'three.pin.status.export'"
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
          v-auth="'three.pin.status.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑引脚状态', row, false)"
        >
          编辑
        </el-button>
        <el-button
            v-auth="'three.pin.status.remove'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <ThreePinStatusForm ref="threePinStatusRef" />
    <ImportExcel ref="ImportExcelRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  CirclePlus,
  Delete,
  EditPen,
  Upload,
  Download,
} from '@element-plus/icons-vue'
import ProTable from '@/components/ProTable/index.vue'
import {
  createThreePinStatusApi,
  removeThreePinStatusApi,
  updateThreePinStatusApi,
  getThreePinStatusListApi,
  getThreePinStatusDetailApi,
  importThreePinStatusExcelApi,
  exportThreePinStatusExcelApi,
} from '@/api/modules/threepinstatus/threePinStatus';
import { useHandleData } from '@/hooks/useHandleData';
import ThreePinStatusForm from '@/views/threepinstatus/threePinStatus/components/ThreePinStatusForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IThreePinStatus } from '@/api/interface/threepinstatus/threePinStatus';
import ImportExcel from '@/components/ImportExcel/index.vue';
import { downloadTemplate } from '@/api/modules/system/common';
import { ElMessageBox } from "element-plus";
import { useDownload } from "@/hooks/useDownload";
defineOptions({
  name: 'ThreePinStatusView'
})
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IThreePinStatus.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'collectorId', label: '采集器ID' },
  { prop: 'pinDef', label: '第几个输入DI' },
  { prop: 'counts', label: '触发次数' },
  { prop: 'triggerTime', label: '上一次触发时间' },
  { prop: 'uptime', label: '触发累计时长' },
  { prop: 'active', label: '当前是否有效' },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
]
// 搜索条件项
const searchColumns: SearchProps[] = [
  { prop: 'collectorId', label: '采集器ID', el: 'input' },
  { prop: 'active', label: '当前是否有效', el: 'input' },
]
// 获取table列表
const getTableList = (params: IThreePinStatus.Query) => {
  let newParams = formatParams(params);
  return getThreePinStatusListApi(newParams);
};
const formatParams = (params: IThreePinStatus.Query) =>{
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.createTimeStart = newParams.createTime[0]);
  newParams.createTime && (newParams.createTimeEnd = newParams.createTime[1]);
  delete newParams.createTime;
  newParams.updateTime && (newParams.updateTimeStart = newParams.updateTime[0]);
  newParams.updateTime && (newParams.updateTimeEnd = newParams.updateTime[1]);
  delete newParams.updateTime;
  newParams.triggerTime && (newParams.triggerTimeStart = newParams.triggerTime[0]);
  newParams.triggerTime && (newParams.triggerTimeEnd = newParams.triggerTime[1]);
  delete newParams.triggerTime;
  return newParams;
}
// 打开 drawer(新增、查看、编辑)
const threePinStatusRef = ref<InstanceType<typeof ThreePinStatusForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getThreePinStatusDetailApi({ id: row?.id })
    row = record?.data
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createThreePinStatusApi : updateThreePinStatusApi,
    getTableList: proTableRef.value?.getTableList
  }
  threePinStatusRef.value?.acceptParams(params)
}
// 删除信息
const deleteInfo = async (params: IThreePinStatus.Row) => {
  await useHandleData(
    removeThreePinStatusApi,
    { ids: [params.id] },
    `删除【${params.id}】引脚状态`
  )
  proTableRef.value?.getTableList()
}
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeThreePinStatusApi, { ids }, '删除所选引脚状态')
  proTableRef.value?.clearSelection()
  proTableRef.value?.getTableList()
}
// 导入
const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>()
const importData = () => {
  const params = {
    title: '引脚状态',
    templateName: '引脚状态',
    tempApi: downloadTemplate,
    importApi: importThreePinStatusExcelApi,
    getTableList: proTableRef.value?.getTableList
  }
  ImportExcelRef.value?.acceptParams(params)
}
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as IThreePinStatus.Query);
  useDownload(exportThreePinStatusExcelApi, "引脚状态", newParams);
};
</script>