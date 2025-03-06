<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="出厂记录"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
      row-key="id"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary"
          v-auth="'three.factory.version.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增出厂记录')"
        >
          新增
        </el-button>
        <el-button
          v-auth="'three.factory.version.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
        <el-button
          v-auth="'three.factory.version.import'"
          type="primary"
          :icon="Upload"
          plain
          @click="importData"
        >
          导入
        </el-button>
        <el-button
          v-auth="'three.factory.version.export'"
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
          v-auth="'three.factory.version.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑出厂记录', row, false)"
        >
          编辑
        </el-button>
        <el-button
            v-auth="'three.factory.version.remove'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <ThreeFactoryVersionForm ref="threeFactoryVersionRef" />
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
  createThreeFactoryVersionApi,
  removeThreeFactoryVersionApi,
  updateThreeFactoryVersionApi,
  getThreeFactoryVersionListApi,
  getThreeFactoryVersionDetailApi,
  importThreeFactoryVersionExcelApi,
  exportThreeFactoryVersionExcelApi,
} from '@/api/modules/threefactoryversion/threeFactoryVersion';
import { useHandleData } from '@/hooks/useHandleData';
import ThreeFactoryVersionForm from '@/views/threefactoryversion/threeFactoryVersion/components/ThreeFactoryVersionForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IThreeFactoryVersion } from '@/api/interface/threefactoryversion/threeFactoryVersion';
import ImportExcel from '@/components/ImportExcel/index.vue';
import { downloadTemplate } from '@/api/modules/system/common';
import { ElMessageBox } from "element-plus";
import { useDownload } from "@/hooks/useDownload";
defineOptions({
  name: 'ThreeFactoryVersionView'
})
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IThreeFactoryVersion.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'imei', label: 'IMEI' },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
]
// 搜索条件项
const searchColumns: SearchProps[] = [
  { prop: 'imei', label: 'IMEI', el: 'input' },
]
// 获取table列表
const getTableList = (params: IThreeFactoryVersion.Query) => {
  let newParams = formatParams(params);
  return getThreeFactoryVersionListApi(newParams);
};
const formatParams = (params: IThreeFactoryVersion.Query) =>{
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
  return newParams;
}
// 打开 drawer(新增、查看、编辑)
const threeFactoryVersionRef = ref<InstanceType<typeof ThreeFactoryVersionForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getThreeFactoryVersionDetailApi({ id: row?.id })
    row = record?.data
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createThreeFactoryVersionApi : updateThreeFactoryVersionApi,
    getTableList: proTableRef.value?.getTableList
  }
  threeFactoryVersionRef.value?.acceptParams(params)
}
// 删除信息
const deleteInfo = async (params: IThreeFactoryVersion.Row) => {
  await useHandleData(
    removeThreeFactoryVersionApi,
    { ids: [params.id] },
    `删除【${params.id}】出厂记录`
  )
  proTableRef.value?.getTableList()
}
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeThreeFactoryVersionApi, { ids }, '删除所选出厂记录')
  proTableRef.value?.clearSelection()
  proTableRef.value?.getTableList()
}
// 导入
const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>()
const importData = () => {
  const params = {
    title: '出厂记录',
    templateName: '出厂记录',
    tempApi: downloadTemplate,
    importApi: importThreeFactoryVersionExcelApi,
    getTableList: proTableRef.value?.getTableList
  }
  ImportExcelRef.value?.acceptParams(params)
}
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as IThreeFactoryVersion.Query);
  useDownload(exportThreeFactoryVersionExcelApi, "出厂记录", newParams);
};
</script>