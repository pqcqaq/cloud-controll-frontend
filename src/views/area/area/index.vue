<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="地区信息"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
      row-key="id"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary"
          v-auth="'area.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增地区信息')"
        >
          新增
        </el-button>
        <el-button
          v-auth="'area.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
        <el-button
          v-auth="'area.import'"
          type="primary"
          :icon="Upload"
          plain
          @click="importData"
        >
          导入
        </el-button>
        <el-button
          v-auth="'area.export'"
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
          v-auth="'area.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑地区信息', row, false)"
        >
          编辑
        </el-button>
        <el-button
            v-auth="'area.remove'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <AreaForm ref="areaRef" />
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
  createAreaApi,
  removeAreaApi,
  updateAreaApi,
  getAreaListApi,
  getAreaDetailApi,
  importAreaExcelApi,
  exportAreaExcelApi,
} from '@/api/modules/area/area';
import { useHandleData } from '@/hooks/useHandleData';
import AreaForm from '@/views/area/area/components/AreaForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IArea } from '@/api/interface/area/area';
import ImportExcel from '@/components/ImportExcel/index.vue';
import { downloadTemplate } from '@/api/modules/system/common';
import { ElMessageBox } from "element-plus";
import { useDownload } from "@/hooks/useDownload";
defineOptions({
  name: 'AreaView'
})
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IArea.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'name', label: '名称' },
  { prop: 'level', label: '行政级别' },
  { prop: 'depth', label: '层级深度' },
  { prop: 'parentId', label: '父ID' },
  { prop: 'code', label: '代码' },
  { prop: 'center', label: '中心点' },
  { prop: '$$seq$$', label: '序号' },
  { prop: '$$createAt$$', label: '创建时间' },
  { prop: '$$updateAt$$', label: '更新时间' },
  { prop: '$$deleteAt$$', label: '删除时间' },
  { prop: '$$triggerData$$', label: '' },
  { prop: '$$triggerUuid$$', label: '' },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
]
// 搜索条件项
const searchColumns: SearchProps[] = [
  { prop: 'name', label: '名称', el: 'input' },
  { prop: 'level', label: '行政级别', el: 'input' },
  { prop: 'depth', label: '层级深度', el: 'input' },
  { prop: 'code', label: '代码', el: 'input' },
]
// 获取table列表
const getTableList = (params: IArea.Query) => {
  let newParams = formatParams(params);
  return getAreaListApi(newParams);
};
const formatParams = (params: IArea.Query) =>{
  let newParams = JSON.parse(JSON.stringify(params));
  return newParams;
}
// 打开 drawer(新增、查看、编辑)
const areaRef = ref<InstanceType<typeof AreaForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getAreaDetailApi({ id: row?.id })
    row = record?.data
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createAreaApi : updateAreaApi,
    getTableList: proTableRef.value?.getTableList
  }
  areaRef.value?.acceptParams(params)
}
// 删除信息
const deleteInfo = async (params: IArea.Row) => {
  await useHandleData(
    removeAreaApi,
    { ids: [params.id] },
    `删除【${params.id}】地区信息`
  )
  proTableRef.value?.getTableList()
}
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeAreaApi, { ids }, '删除所选地区信息')
  proTableRef.value?.clearSelection()
  proTableRef.value?.getTableList()
}
// 导入
const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>()
const importData = () => {
  const params = {
    title: '地区信息',
    templateName: '地区信息',
    tempApi: downloadTemplate,
    importApi: importAreaExcelApi,
    getTableList: proTableRef.value?.getTableList
  }
  ImportExcelRef.value?.acceptParams(params)
}
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as IArea.Query);
  useDownload(exportAreaExcelApi, "地区信息", newParams);
};
</script>