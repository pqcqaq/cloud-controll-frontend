<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="锁机信息"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
      row-key="id"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary"
          v-auth="'three.collector.lock.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增锁机信息')"
        >
          新增
        </el-button>
        <el-button
          v-auth="'three.collector.lock.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
        <el-button
          v-auth="'three.collector.lock.import'"
          type="primary"
          :icon="Upload"
          plain
          @click="importData"
        >
          导入
        </el-button>
        <el-button
          v-auth="'three.collector.lock.export'"
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
          v-auth="'three.collector.lock.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑锁机信息', row, false)"
        >
          编辑
        </el-button>
        <el-button
            v-auth="'three.collector.lock.remove'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <ThreeCollectorLockForm ref="threeCollectorLockRef" />
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
  createThreeCollectorLockApi,
  removeThreeCollectorLockApi,
  updateThreeCollectorLockApi,
  getThreeCollectorLockListApi,
  getThreeCollectorLockDetailApi,
  importThreeCollectorLockExcelApi,
  exportThreeCollectorLockExcelApi,
} from '@/api/modules/threecollectorlock/threeCollectorLock';
import { useHandleData } from '@/hooks/useHandleData';
import ThreeCollectorLockForm from '@/views/threecollectorlock/threeCollectorLock/components/ThreeCollectorLockForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IThreeCollectorLock } from '@/api/interface/threecollectorlock/threeCollectorLock';
import ImportExcel from '@/components/ImportExcel/index.vue';
import { downloadTemplate } from '@/api/modules/system/common';
import { ElMessageBox } from "element-plus";
import { useDownload } from "@/hooks/useDownload";
defineOptions({
  name: 'ThreeCollectorLockView'
})
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IThreeCollectorLock.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'collectorId', label: '采集器ID' },
  { prop: 'lockedTime', label: '锁机时间' },
  { prop: 'unlockTime', label: '解锁时间' },
  { prop: 'status', label: '锁机状态' },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
]
// 搜索条件项
const searchColumns: SearchProps[] = [
  { prop: 'collectorId', label: '采集器ID', el: 'input' },
  { prop: 'lockedTime',
    label: '锁机时间',
    el: 'date-picker',
    span: 2,
    props: {
      type: "datetimerange",
      valueFormat: "YYYY-MM-DD HH:mm:ss"
    },
  },
  { prop: 'unlockTime',
    label: '解锁时间',
    el: 'date-picker',
    span: 2,
    props: {
      type: "datetimerange",
      valueFormat: "YYYY-MM-DD HH:mm:ss"
    },
  },
  { prop: 'status', label: '锁机状态', el: 'select' },
]
// 获取table列表
const getTableList = (params: IThreeCollectorLock.Query) => {
  let newParams = formatParams(params);
  return getThreeCollectorLockListApi(newParams);
};
const formatParams = (params: IThreeCollectorLock.Query) =>{
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.createTimeStart = newParams.createTime[0]);
  newParams.createTime && (newParams.createTimeEnd = newParams.createTime[1]);
  delete newParams.createTime;
  newParams.updateTime && (newParams.updateTimeStart = newParams.updateTime[0]);
  newParams.updateTime && (newParams.updateTimeEnd = newParams.updateTime[1]);
  delete newParams.updateTime;
  newParams.lockedTime && (newParams.lockedTimeStart = newParams.lockedTime[0]);
  newParams.lockedTime && (newParams.lockedTimeEnd = newParams.lockedTime[1]);
  delete newParams.lockedTime;
  newParams.unlockTime && (newParams.unlockTimeStart = newParams.unlockTime[0]);
  newParams.unlockTime && (newParams.unlockTimeEnd = newParams.unlockTime[1]);
  delete newParams.unlockTime;
  newParams.deleteTime && (newParams.deleteTimeStart = newParams.deleteTime[0]);
  newParams.deleteTime && (newParams.deleteTimeEnd = newParams.deleteTime[1]);
  delete newParams.deleteTime;
  return newParams;
}
// 打开 drawer(新增、查看、编辑)
const threeCollectorLockRef = ref<InstanceType<typeof ThreeCollectorLockForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getThreeCollectorLockDetailApi({ id: row?.id })
    row = record?.data
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createThreeCollectorLockApi : updateThreeCollectorLockApi,
    getTableList: proTableRef.value?.getTableList
  }
  threeCollectorLockRef.value?.acceptParams(params)
}
// 删除信息
const deleteInfo = async (params: IThreeCollectorLock.Row) => {
  await useHandleData(
    removeThreeCollectorLockApi,
    { ids: [params.id] },
    `删除【${params.id}】锁机信息`
  )
  proTableRef.value?.getTableList()
}
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeThreeCollectorLockApi, { ids }, '删除所选锁机信息')
  proTableRef.value?.clearSelection()
  proTableRef.value?.getTableList()
}
// 导入
const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>()
const importData = () => {
  const params = {
    title: '锁机信息',
    templateName: '锁机信息',
    tempApi: downloadTemplate,
    importApi: importThreeCollectorLockExcelApi,
    getTableList: proTableRef.value?.getTableList
  }
  ImportExcelRef.value?.acceptParams(params)
}
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as IThreeCollectorLock.Query);
  useDownload(exportThreeCollectorLockExcelApi, "锁机信息", newParams);
};
</script>