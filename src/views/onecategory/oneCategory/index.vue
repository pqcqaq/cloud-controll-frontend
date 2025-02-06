<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="产线"
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
          v-auth="'one.category.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增产线')"
        >
          新增
        </el-button>
        <el-button
          v-auth="'one.category.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
        <el-button
          v-auth="'one.category.import'"
          type="primary"
          :icon="Upload"
          plain
          @click="importData"
        >
          导入
        </el-button>
        <el-button
          v-auth="'one.category.export'"
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
          v-auth="'one.category.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑产线', row, false)"
        >
          编辑
        </el-button>
        <el-button
          v-auth="'one.category.remove'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <OneCategoryForm ref="assemblyRef" />
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
  createOneCategoryApi,
  removeOneCategoryApi,
  updateOneCategoryApi,
  getOneCategoryListApi,
  getOneCategoryDetailApi,
  importOneCategoryExcelApi,
  exportOneCategoryExcelApi,
} from '@/api/modules/onecategory/assembly';
import { useHandleData } from '@/hooks/useHandleData';
import OneCategoryForm from '@/views/onecategory/oneCategory/components/OneCategoryForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IOneCategory } from '@/api/interface/onecategory/assembly';
import ImportExcel from '@/components/ImportExcel/index.vue';
import { downloadTemplate } from '@/api/modules/system/common';
import { ElMessageBox } from "element-plus";
import { useDownload } from "@/hooks/useDownload";
defineOptions({
  name: 'OneCategoryView'
})
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IOneCategory.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'sku', label: 'SKU' },
  { prop: 'idCode', label: '产品ID标识' },
  { prop: 'name', label: '产品名称' },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
]
// 搜索条件项
const searchColumns: SearchProps[] = [
  { prop: 'sku', label: 'SKU', el: 'input' },
  { prop: 'idCode', label: '产品ID标识', el: 'input' },
  { prop: 'name', label: '产品名称', el: 'input' },
]
// 获取table列表
const getTableList = (params: IOneCategory.Query) => {
  let newParams = formatParams(params);
  return getOneCategoryListApi(newParams);
};
const formatParams = (params: IOneCategory.Query) =>{
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
const assemblyRef = ref<InstanceType<typeof OneCategoryForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getOneCategoryDetailApi({ id: row?.id })
    row = record?.data
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createOneCategoryApi : updateOneCategoryApi,
    getTableList: proTableRef.value?.getTableList
  }
  assemblyRef.value?.acceptParams(params)
}
// 删除信息
const deleteInfo = async (params: IOneCategory.Row) => {
  await useHandleData(
    removeOneCategoryApi,
    { ids: [params.id] },
    `删除【${params.id}】产线`
  )
  proTableRef.value?.getTableList()
}
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeOneCategoryApi, { ids }, '删除所选产线')
  proTableRef.value?.clearSelection()
  proTableRef.value?.getTableList()
}
// 导入
const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>()
const importData = () => {
  const params = {
    title: '产线',
    templateName: '产线',
    tempApi: downloadTemplate,
    importApi: importOneCategoryExcelApi,
    getTableList: proTableRef.value?.getTableList
  }
  ImportExcelRef.value?.acceptParams(params)
}
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as IOneCategory.Query);
  useDownload(exportOneCategoryExcelApi, "产线", newParams);
};
</script>