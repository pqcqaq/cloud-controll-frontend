<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="称重记录"
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
          v-auth="'one.weigh.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增称重记录')"
        >
          新增
        </el-button>
        <el-button
          v-auth="'one.weigh.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
        <el-button
          v-auth="'one.weigh.import'"
          type="primary"
          :icon="Upload"
          plain
          @click="importData"
        >
          导入
        </el-button>
        <el-button
          v-auth="'one.weigh.export'"
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
          v-auth="'one.weigh.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑称重记录', row, false)"
        >
          编辑
        </el-button>
        <el-button
          v-auth="'one.weigh.remove'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <OneWeighForm ref="oneRef" />
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
  createOneWeighApi,
  removeOneWeighApi,
  updateOneWeighApi,
  getOneWeighListApi,
  getOneWeighDetailApi,
  importOneWeighExcelApi,
  exportOneWeighExcelApi,
} from '@/api/modules/oneweigh/one';
import { useHandleData } from '@/hooks/useHandleData';
import OneWeighForm from '@/views/oneweigh/oneWeigh/components/OneWeighForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IOneWeigh } from '@/api/interface/oneweigh/one';
import ImportExcel from '@/components/ImportExcel/index.vue';
import { downloadTemplate } from '@/api/modules/system/common';
import { useDownload } from "@/hooks/useDownload";
defineOptions({
  name: 'OneWeighView'
})
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IOneWeigh.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'weight', label: '称重信息' },
  { prop: 'productName', label: '产品信息' },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
]
// 搜索条件项
const searchColumns: SearchProps[] = [
  { prop: 'weight', label: '称重信息', el: 'input' },
  { prop: 'productId', label: '产品信息', el: 'input' },
]
// 获取table列表
const getTableList = (params: IOneWeigh.Query) => {
  let newParams = formatParams(params);
  return getOneWeighListApi(newParams);
};
const formatParams = (params: IOneWeigh.Query) =>{
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
const oneRef = ref<InstanceType<typeof OneWeighForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getOneWeighDetailApi({ id: row?.id })
    row = record?.data
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createOneWeighApi : updateOneWeighApi,
    getTableList: proTableRef.value?.getTableList
  }
  oneRef.value?.acceptParams(params)
}
// 删除信息
const deleteInfo = async (params: IOneWeigh.Row) => {
  await useHandleData(
    removeOneWeighApi,
    { ids: [params.id] },
    `删除【${params.id}】称重记录`
  )
  proTableRef.value?.getTableList()
}
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeOneWeighApi, { ids }, '删除所选称重记录')
  proTableRef.value?.clearSelection()
  proTableRef.value?.getTableList()
}
// 导入
const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>()
const importData = () => {
  const params = {
    title: '称重记录',
    templateName: '称重记录',
    tempApi: downloadTemplate,
    importApi: importOneWeighExcelApi,
    getTableList: proTableRef.value?.getTableList
  }
  ImportExcelRef.value?.acceptParams(params)
}
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as IOneWeigh.Query);
  useDownload(exportOneWeighExcelApi, "称重记录", newParams);
};
</script>