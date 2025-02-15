<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="生产类别"
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
          @click="openAddEdit('新增生产类别')"
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
          @click="openAddEdit('编辑生产类别', row, false)"
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
import { h, ref } from 'vue'
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
import { useDownload } from "@/hooks/useDownload";
import { ElTag } from 'element-plus';
defineOptions({
  name: 'OneCategoryView'
})
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IOneCategory.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'name', label: '产品名称', width: 200 },
  { prop: 'sku', label: 'SKU', width: 120 },
  { prop: 'idCode', label: '产品ID标识', width: 120 },
  { prop: 'salesCode', label: '销售码', width: 160 },
  // color
  { prop: 'color', label: '颜色', width: 120 },
  { prop: 'minWeight', label: '最小重量', width: 120 },
  { prop: 'maxWeight', label: '最大重量', width: 120 },
  // midBoxNum?: number
  // palletNum?: number
  { prop: "midBoxNum", label: "中箱内产品数量", width: 120 },
  { prop: "palletNum", label: "栈板内中箱数量", width: 120 },
  // 是否需要SN
  { 
    prop: 'needSn', 
    label: '是否需要SN', 
    width: 120, 
    render: ({ row }) => row.needSn ? h(ElTag, { type: 'success' }, ['是']) : h(ElTag, { type: 'danger' }, ['否'])
  },
  { 
    prop: 'needWeigh', 
    label: '是否称重', 
    width: 120, 
    render: ({ row }) => row.needWeigh ? h(ElTag, { type: 'success' }, ['是']) : h(ElTag, { type: 'danger' }, ['否'])
  },
  { 
    prop: 'needMidBox', 
    label: '是否需要中箱', 
    width: 120, 
    render: ({ row }) => row.needMidBox ? h(ElTag, { type: 'success' }, ['是']) : h(ElTag, { type: 'danger' }, ['否'])
  },
  { 
    prop: 'needPallet', 
    label: '是否需要栈板', 
    width: 120, 
    render: ({ row }) => row.needPallet ? h(ElTag, { type: 'success' }, ['是']) : h(ElTag, { type: 'danger' }, ['否'])
  },
  { prop: 'midBoxTemplateName', label: '中箱模板文件名', width: 120 },
  { prop: 'palletTemplateName', label: '栈板模板文件名', width: 120 },
  { prop: 'productTemplateName', label: '产品模板文件名', width: 120 },
  { prop: 'snTemplateName', label: 'SN模板文件名', width: 120 },
  { prop: 'destTemplateName', label: '目的地模板文件名', width: 120 },
  { prop: 'packingSpec', label: '包装规格', width: 120 },
  { prop: 'grossWeight', label: '毛重', width: 120 },
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
    `删除【${params.id}】生产类别`
  )
  proTableRef.value?.getTableList()
}
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeOneCategoryApi, { ids }, '删除所选生产类别')
  proTableRef.value?.clearSelection()
  proTableRef.value?.getTableList()
}
// 导入
const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>()
const importData = () => {
  const params = {
    title: '生产类别',
    templateName: '生产类别',
    tempApi: downloadTemplate,
    importApi: importOneCategoryExcelApi,
    getTableList: proTableRef.value?.getTableList
  }
  ImportExcelRef.value?.acceptParams(params)
}
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as IOneCategory.Query);
  useDownload(exportOneCategoryExcelApi, "生产类别", newParams);
};
</script>