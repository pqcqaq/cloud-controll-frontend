<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="设备登录信息"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
      row-key="id"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary"
          v-auth="'three.collector.login.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增设备登录信息')"
        >
          新增
        </el-button>
        <el-button
          v-auth="'three.collector.login.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
        <el-button
          v-auth="'three.collector.login.import'"
          type="primary"
          :icon="Upload"
          plain
          @click="importData"
        >
          导入
        </el-button>
        <el-button
          v-auth="'three.collector.login.export'"
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
          v-auth="'three.collector.login.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑设备登录信息', row, false)"
        >
          编辑
        </el-button>
        <el-button
            v-auth="'three.collector.login.remove'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <ThreeCollectorLoginForm ref="threeCollectorLoginRef" />
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
  createThreeCollectorLoginApi,
  removeThreeCollectorLoginApi,
  updateThreeCollectorLoginApi,
  getThreeCollectorLoginListApi,
  getThreeCollectorLoginDetailApi,
  importThreeCollectorLoginExcelApi,
  exportThreeCollectorLoginExcelApi,
} from '@/api/modules/threecollectorlogin/threeCollectorLogin';
import { useHandleData } from '@/hooks/useHandleData';
import ThreeCollectorLoginForm from '@/views/threecollectorlogin/threeCollectorLogin/components/ThreeCollectorLoginForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IThreeCollectorLogin } from '@/api/interface/threecollectorlogin/threeCollectorLogin';
import ImportExcel from '@/components/ImportExcel/index.vue';
import { downloadTemplate } from '@/api/modules/system/common';
import { ElMessageBox } from "element-plus";
import { useDownload } from "@/hooks/useDownload";
defineOptions({
  name: 'ThreeCollectorLoginView'
})
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IThreeCollectorLogin.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'collectorId', label: '采集器ID' },
  { prop: 'accessToken', label: '访问密钥' },
  { prop: 'shutdownAt', label: '下线时间' },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
]
// 搜索条件项
const searchColumns: SearchProps[] = [
  { prop: 'collectorId', label: '采集器ID', el: 'input' },
  { prop: 'accessToken', label: '访问密钥', el: 'input' },
  { prop: 'shutdownAt', label: '下线时间', el: 'input' },
]
// 获取table列表
const getTableList = (params: IThreeCollectorLogin.Query) => {
  let newParams = formatParams(params);
  return getThreeCollectorLoginListApi(newParams);
};
const formatParams = (params: IThreeCollectorLogin.Query) =>{
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.createTimeStart = newParams.createTime[0]);
  newParams.createTime && (newParams.createTimeEnd = newParams.createTime[1]);
  delete newParams.createTime;
  newParams.updateTime && (newParams.updateTimeStart = newParams.updateTime[0]);
  newParams.updateTime && (newParams.updateTimeEnd = newParams.updateTime[1]);
  delete newParams.updateTime;
  newParams.shutdownAt && (newParams.shutdownAtStart = newParams.shutdownAt[0]);
  newParams.shutdownAt && (newParams.shutdownAtEnd = newParams.shutdownAt[1]);
  delete newParams.shutdownAt;
  return newParams;
}
// 打开 drawer(新增、查看、编辑)
const threeCollectorLoginRef = ref<InstanceType<typeof ThreeCollectorLoginForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getThreeCollectorLoginDetailApi({ id: row?.id })
    row = record?.data
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createThreeCollectorLoginApi : updateThreeCollectorLoginApi,
    getTableList: proTableRef.value?.getTableList
  }
  threeCollectorLoginRef.value?.acceptParams(params)
}
// 删除信息
const deleteInfo = async (params: IThreeCollectorLogin.Row) => {
  await useHandleData(
    removeThreeCollectorLoginApi,
    { ids: [params.id] },
    `删除【${params.id}】设备登录信息`
  )
  proTableRef.value?.getTableList()
}
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeThreeCollectorLoginApi, { ids }, '删除所选设备登录信息')
  proTableRef.value?.clearSelection()
  proTableRef.value?.getTableList()
}
// 导入
const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>()
const importData = () => {
  const params = {
    title: '设备登录信息',
    templateName: '设备登录信息',
    tempApi: downloadTemplate,
    importApi: importThreeCollectorLoginExcelApi,
    getTableList: proTableRef.value?.getTableList
  }
  ImportExcelRef.value?.acceptParams(params)
}
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as IThreeCollectorLogin.Query);
  useDownload(exportThreeCollectorLoginExcelApi, "设备登录信息", newParams);
};
</script>