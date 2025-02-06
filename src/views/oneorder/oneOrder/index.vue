<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="产线一"
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
          v-auth="'one.order.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增产线一')"
        >
          新增
        </el-button>
        <el-button
          v-auth="'one.order.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
        <el-button
          v-auth="'one.order.import'"
          type="primary"
          :icon="Upload"
          plain
          @click="importData"
        >
          导入
        </el-button>
        <el-button
          v-auth="'one.order.export'"
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
          v-auth="'one.order.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑产线一', row, false)"
        >
          编辑
        </el-button>
        <el-button
          v-auth="'one.order.remove'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <OneOrderForm ref="oneRef" />
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
  createOneOrderApi,
  removeOneOrderApi,
  updateOneOrderApi,
  getOneOrderListApi,
  getOneOrderDetailApi,
  importOneOrderExcelApi,
  exportOneOrderExcelApi,
} from '@/api/modules/oneorder/one';
import { useHandleData } from '@/hooks/useHandleData';
import OneOrderForm from '@/views/oneorder/oneOrder/components/OneOrderForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IOneOrder } from '@/api/interface/oneorder/one';
import ImportExcel from '@/components/ImportExcel/index.vue';
import { downloadTemplate } from '@/api/modules/system/common';
import { ElMessageBox } from "element-plus";
import { useDownload } from "@/hooks/useDownload";
defineOptions({
  name: 'OneOrderView'
})
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IOneOrder.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'categoryId', label: '类别ID' },
  { prop: 'palletId', label: '托盘ID' },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
]
// 搜索条件项
const searchColumns: SearchProps[] = [
  { prop: 'categoryId', label: '类别ID', el: 'input' },
  { prop: 'palletId', label: '托盘ID', el: 'input' },
]
// 获取table列表
const getTableList = (params: IOneOrder.Query) => {
  let newParams = formatParams(params);
  return getOneOrderListApi(newParams);
};
const formatParams = (params: IOneOrder.Query) =>{
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
const oneRef = ref<InstanceType<typeof OneOrderForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getOneOrderDetailApi({ id: row?.id })
    row = record?.data
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createOneOrderApi : updateOneOrderApi,
    getTableList: proTableRef.value?.getTableList
  }
  oneRef.value?.acceptParams(params)
}
// 删除信息
const deleteInfo = async (params: IOneOrder.Row) => {
  await useHandleData(
    removeOneOrderApi,
    { ids: [params.id] },
    `删除【${params.id}】产线一`
  )
  proTableRef.value?.getTableList()
}
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeOneOrderApi, { ids }, '删除所选产线一')
  proTableRef.value?.clearSelection()
  proTableRef.value?.getTableList()
}
// 导入
const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>()
const importData = () => {
  const params = {
    title: '产线一',
    templateName: '产线一',
    tempApi: downloadTemplate,
    importApi: importOneOrderExcelApi,
    getTableList: proTableRef.value?.getTableList
  }
  ImportExcelRef.value?.acceptParams(params)
}
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as IOneOrder.Query);
  useDownload(exportOneOrderExcelApi, "产线一", newParams);
};
</script>