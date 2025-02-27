<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="回传记录"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
      row-key="id"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary"
          v-auth="'three.passback.log.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增回传记录')"
        >
          新增
        </el-button>
        <el-button
          v-auth="'three.passback.log.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
        <el-button
          v-auth="'three.passback.log.import'"
          type="primary"
          :icon="Upload"
          plain
          @click="importData"
        >
          导入
        </el-button>
        <el-button
          v-auth="'three.passback.log.export'"
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
          v-auth="'three.passback.log.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑回传记录', row, false)"
        >
          编辑
        </el-button>
        <el-button
            v-auth="'three.passback.log.remove'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <ThreePassbackLogForm ref="threePassbackLogRef" />
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
  createThreePassbackLogApi,
  removeThreePassbackLogApi,
  updateThreePassbackLogApi,
  getThreePassbackLogListApi,
  getThreePassbackLogDetailApi,
  importThreePassbackLogExcelApi,
  exportThreePassbackLogExcelApi,
} from '@/api/modules/threepassbacklog/threePassbackLog';
import { useHandleData } from '@/hooks/useHandleData';
import ThreePassbackLogForm from '@/views/threepassbacklog/threePassbackLog/components/ThreePassbackLogForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IThreePassbackLog } from '@/api/interface/threepassbacklog/threePassbackLog';
import ImportExcel from '@/components/ImportExcel/index.vue';
import { downloadTemplate } from '@/api/modules/system/common';
import { ElMessageBox } from "element-plus";
import { useDownload } from "@/hooks/useDownload";
defineOptions({
  name: 'ThreePassbackLogView'
})
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IThreePassbackLog.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'collectorId', label: '设备ID' },
  { prop: 'raw', label: '原始数据' },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
]
// 搜索条件项
const searchColumns: SearchProps[] = [
  { prop: 'collectorId', label: '设备ID', el: 'input' },
]
// 获取table列表
const getTableList = (params: IThreePassbackLog.Query) => {
  let newParams = formatParams(params);
  return getThreePassbackLogListApi(newParams);
};
const formatParams = (params: IThreePassbackLog.Query) =>{
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.createTimeStart = newParams.createTime[0]);
  newParams.createTime && (newParams.createTimeEnd = newParams.createTime[1]);
  delete newParams.createTime;
  newParams.updateTime && (newParams.updateTimeStart = newParams.updateTime[0]);
  newParams.updateTime && (newParams.updateTimeEnd = newParams.updateTime[1]);
  delete newParams.updateTime;
  return newParams;
}
// 打开 drawer(新增、查看、编辑)
const threePassbackLogRef = ref<InstanceType<typeof ThreePassbackLogForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getThreePassbackLogDetailApi({ id: row?.id })
    row = record?.data
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createThreePassbackLogApi : updateThreePassbackLogApi,
    getTableList: proTableRef.value?.getTableList
  }
  threePassbackLogRef.value?.acceptParams(params)
}
// 删除信息
const deleteInfo = async (params: IThreePassbackLog.Row) => {
  await useHandleData(
    removeThreePassbackLogApi,
    { ids: [params.id] },
    `删除【${params.id}】回传记录`
  )
  proTableRef.value?.getTableList()
}
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeThreePassbackLogApi, { ids }, '删除所选回传记录')
  proTableRef.value?.clearSelection()
  proTableRef.value?.getTableList()
}
// 导入
const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>()
const importData = () => {
  const params = {
    title: '回传记录',
    templateName: '回传记录',
    tempApi: downloadTemplate,
    importApi: importThreePassbackLogExcelApi,
    getTableList: proTableRef.value?.getTableList
  }
  ImportExcelRef.value?.acceptParams(params)
}
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as IThreePassbackLog.Query);
  useDownload(exportThreePassbackLogExcelApi, "回传记录", newParams);
};
</script>