<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="采集器事件"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
      row-key="id"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary"
          v-auth="'three.collector.event.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增采集器事件')"
        >
          新增
        </el-button>
        <el-button
          v-auth="'three.collector.event.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
        <el-button
          v-auth="'three.collector.event.import'"
          type="primary"
          :icon="Upload"
          plain
          @click="importData"
        >
          导入
        </el-button>
        <el-button
          v-auth="'three.collector.event.export'"
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
          v-auth="'three.collector.event.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑采集器事件', row, false)"
        >
          编辑
        </el-button>
        <el-button
            v-auth="'three.collector.event.remove'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <ThreeCollectorEventForm ref="threeCollectorEventRef" />
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
  createThreeCollectorEventApi,
  removeThreeCollectorEventApi,
  updateThreeCollectorEventApi,
  getThreeCollectorEventListApi,
  getThreeCollectorEventDetailApi,
  importThreeCollectorEventExcelApi,
  exportThreeCollectorEventExcelApi,
} from '@/api/modules/threecollectorevent/threeCollectorEvent';
import { useHandleData } from '@/hooks/useHandleData';
import ThreeCollectorEventForm from '@/views/threecollectorevent/threeCollectorEvent/components/ThreeCollectorEventForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IThreeCollectorEvent } from '@/api/interface/threecollectorevent/threeCollectorEvent';
import ImportExcel from '@/components/ImportExcel/index.vue';
import { downloadTemplate } from '@/api/modules/system/common';
import { ElMessageBox } from "element-plus";
import { useDownload } from "@/hooks/useDownload";
defineOptions({
  name: 'ThreeCollectorEventView'
})
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IThreeCollectorEvent.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'level', label: '事件等级' },
  { prop: 'type', label: '事件类型' },
  { prop: 'msg', label: '信息' },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
]
// 搜索条件项
const searchColumns: SearchProps[] = [
  { prop: 'level', label: '事件等级', el: 'input' },
  { prop: 'type', label: '事件类型', el: 'select' },
  { prop: 'msg', label: '信息', el: 'input' },
]
// 获取table列表
const getTableList = (params: IThreeCollectorEvent.Query) => {
  let newParams = formatParams(params);
  return getThreeCollectorEventListApi(newParams);
};
const formatParams = (params: IThreeCollectorEvent.Query) =>{
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
const threeCollectorEventRef = ref<InstanceType<typeof ThreeCollectorEventForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getThreeCollectorEventDetailApi({ id: row?.id })
    row = record?.data
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createThreeCollectorEventApi : updateThreeCollectorEventApi,
    getTableList: proTableRef.value?.getTableList
  }
  threeCollectorEventRef.value?.acceptParams(params)
}
// 删除信息
const deleteInfo = async (params: IThreeCollectorEvent.Row) => {
  await useHandleData(
    removeThreeCollectorEventApi,
    { ids: [params.id] },
    `删除【${params.id}】采集器事件`
  )
  proTableRef.value?.getTableList()
}
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeThreeCollectorEventApi, { ids }, '删除所选采集器事件')
  proTableRef.value?.clearSelection()
  proTableRef.value?.getTableList()
}
// 导入
const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>()
const importData = () => {
  const params = {
    title: '采集器事件',
    templateName: '采集器事件',
    tempApi: downloadTemplate,
    importApi: importThreeCollectorEventExcelApi,
    getTableList: proTableRef.value?.getTableList
  }
  ImportExcelRef.value?.acceptParams(params)
}
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as IThreeCollectorEvent.Query);
  useDownload(exportThreeCollectorEventExcelApi, "采集器事件", newParams);
};
</script>