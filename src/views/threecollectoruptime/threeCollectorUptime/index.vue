<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="开启时间统计"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
      row-key="id"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary"
          v-auth="'three.collector.uptime.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增开启时间统计')"
        >
          新增
        </el-button>
        <el-button
          v-auth="'three.collector.uptime.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
        <el-button
          v-auth="'three.collector.uptime.import'"
          type="primary"
          :icon="Upload"
          plain
          @click="importData"
        >
          导入
        </el-button>
        <el-button
          v-auth="'three.collector.uptime.export'"
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
          v-auth="'three.collector.uptime.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑开启时间统计', row, false)"
        >
          编辑
        </el-button>
        <el-button
            v-auth="'three.collector.uptime.remove'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <ThreeCollectorUptimeForm ref="threeCollectorUptimeRef" />
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
  createThreeCollectorUptimeApi,
  removeThreeCollectorUptimeApi,
  updateThreeCollectorUptimeApi,
  getThreeCollectorUptimeListApi,
  getThreeCollectorUptimeDetailApi,
  importThreeCollectorUptimeExcelApi,
  exportThreeCollectorUptimeExcelApi,
} from '@/api/modules/threecollectoruptime/threeCollectorUptime';
import { useHandleData } from '@/hooks/useHandleData';
import ThreeCollectorUptimeForm from '@/views/threecollectoruptime/threeCollectorUptime/components/ThreeCollectorUptimeForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IThreeCollectorUptime } from '@/api/interface/threecollectoruptime/threeCollectorUptime';
import ImportExcel from '@/components/ImportExcel/index.vue';
import { downloadTemplate } from '@/api/modules/system/common';
import { ElMessageBox } from "element-plus";
import { useDownload } from "@/hooks/useDownload";
defineOptions({
  name: 'ThreeCollectorUptimeView'
})
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IThreeCollectorUptime.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'uptime', label: '总计在线时间' },
  { prop: 'countDate', label: '统计的时间' },
  { prop: 'hours', label: '24小时内的开启时间' },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
]
// 搜索条件项
const searchColumns: SearchProps[] = [
  { prop: 'uptime',
    label: '总计在线时间',
    el: 'date-picker',
    span: 2,
    props: {
      type: "datetimerange",
      valueFormat: "YYYY-MM-DD HH:mm:ss"
    },
  },
  { prop: 'countDate', label: '统计的时间', el: 'input' },
  { prop: 'hours', label: '24小时内的开启时间', el: 'input' },
]
// 获取table列表
const getTableList = (params: IThreeCollectorUptime.Query) => {
  let newParams = formatParams(params);
  return getThreeCollectorUptimeListApi(newParams);
};
const formatParams = (params: IThreeCollectorUptime.Query) =>{
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.createTimeStart = newParams.createTime[0]);
  newParams.createTime && (newParams.createTimeEnd = newParams.createTime[1]);
  delete newParams.createTime;
  newParams.updateTime && (newParams.updateTimeStart = newParams.updateTime[0]);
  newParams.updateTime && (newParams.updateTimeEnd = newParams.updateTime[1]);
  delete newParams.updateTime;
  newParams.deleteTime && (newParams.deleteTimeStart = newParams.deleteTime[0]);
  newParams.deleteTime && (newParams.deleteTimeEnd = newParams.deleteTime[1]);
  delete newParams.deleteTime;
  newParams.countDate && (newParams.countDateStart = newParams.countDate[0]);
  newParams.countDate && (newParams.countDateEnd = newParams.countDate[1]);
  delete newParams.countDate;
  return newParams;
}
// 打开 drawer(新增、查看、编辑)
const threeCollectorUptimeRef = ref<InstanceType<typeof ThreeCollectorUptimeForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getThreeCollectorUptimeDetailApi({ id: row?.id })
    row = record?.data
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createThreeCollectorUptimeApi : updateThreeCollectorUptimeApi,
    getTableList: proTableRef.value?.getTableList
  }
  threeCollectorUptimeRef.value?.acceptParams(params)
}
// 删除信息
const deleteInfo = async (params: IThreeCollectorUptime.Row) => {
  await useHandleData(
    removeThreeCollectorUptimeApi,
    { ids: [params.id] },
    `删除【${params.id}】开启时间统计`
  )
  proTableRef.value?.getTableList()
}
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeThreeCollectorUptimeApi, { ids }, '删除所选开启时间统计')
  proTableRef.value?.clearSelection()
  proTableRef.value?.getTableList()
}
// 导入
const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>()
const importData = () => {
  const params = {
    title: '开启时间统计',
    templateName: '开启时间统计',
    tempApi: downloadTemplate,
    importApi: importThreeCollectorUptimeExcelApi,
    getTableList: proTableRef.value?.getTableList
  }
  ImportExcelRef.value?.acceptParams(params)
}
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as IThreeCollectorUptime.Query);
  useDownload(exportThreeCollectorUptimeExcelApi, "开启时间统计", newParams);
};
</script>