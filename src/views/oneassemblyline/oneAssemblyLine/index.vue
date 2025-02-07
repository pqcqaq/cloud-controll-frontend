<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="产线信息"
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
          v-auth="'one.assembly.line.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增产线信息')"
        >
          新增
        </el-button>
        <el-button
          v-auth="'one.assembly.line.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
        <el-button
          v-auth="'one.assembly.line.import'"
          type="primary"
          :icon="Upload"
          plain
          @click="importData"
        >
          导入
        </el-button>
        <el-button
          v-auth="'one.assembly.line.export'"
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
          v-auth="'one.assembly.line.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑产线信息', row, false)"
        >
          编辑
        </el-button>
        <el-button
          v-auth="'one.assembly.line.remove'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <OneAssemblyLineForm ref="oneAssemblyLineRef" />
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
  createOneAssemblyLineApi,
  removeOneAssemblyLineApi,
  updateOneAssemblyLineApi,
  getOneAssemblyLineListApi,
  getOneAssemblyLineDetailApi,
  importOneAssemblyLineExcelApi,
  exportOneAssemblyLineExcelApi,
} from '@/api/modules/oneassemblyline/oneAssemblyLine';
import { useHandleData } from '@/hooks/useHandleData';
import OneAssemblyLineForm from '@/views/oneassemblyline/oneAssemblyLine/components/OneAssemblyLineForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IOneAssemblyLine } from '@/api/interface/oneassemblyline/oneAssemblyLine';
import ImportExcel from '@/components/ImportExcel/index.vue';
import { downloadTemplate } from '@/api/modules/system/common';
import { useDownload } from "@/hooks/useDownload";
defineOptions({
  name: 'OneAssemblyLineView'
})
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IOneAssemblyLine.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'name', label: '产线名称' },
  { prop: 'idCode', label: '生产类别' },
  { prop: 'categoryName', label: '生产类名' },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
]
// 搜索条件项
const searchColumns: SearchProps[] = [
  { prop: 'name', label: '产线名称', el: 'input' },
  // { prop: 'categoryId', label: '生产类别', el: 'input' },
]
// 获取table列表
const getTableList = (params: IOneAssemblyLine.Query) => {
  let newParams = formatParams(params);
  return getOneAssemblyLineListApi(newParams);
};
const formatParams = (params: IOneAssemblyLine.Query) =>{
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
const oneAssemblyLineRef = ref<InstanceType<typeof OneAssemblyLineForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getOneAssemblyLineDetailApi({ id: row?.id })
    row = record?.data
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createOneAssemblyLineApi : updateOneAssemblyLineApi,
    getTableList: proTableRef.value?.getTableList
  }
  oneAssemblyLineRef.value?.acceptParams(params)
}
// 删除信息
const deleteInfo = async (params: IOneAssemblyLine.Row) => {
  await useHandleData(
    removeOneAssemblyLineApi,
    { ids: [params.id] },
    `删除【${params.id}】产线信息`
  )
  proTableRef.value?.getTableList()
}
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeOneAssemblyLineApi, { ids }, '删除所选产线信息')
  proTableRef.value?.clearSelection()
  proTableRef.value?.getTableList()
}
// 导入
const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>()
const importData = () => {
  const params = {
    title: '产线信息',
    templateName: '产线信息',
    tempApi: downloadTemplate,
    importApi: importOneAssemblyLineExcelApi,
    getTableList: proTableRef.value?.getTableList
  }
  ImportExcelRef.value?.acceptParams(params)
}
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as IOneAssemblyLine.Query);
  useDownload(exportOneAssemblyLineExcelApi, "产线信息", newParams);
};
</script>