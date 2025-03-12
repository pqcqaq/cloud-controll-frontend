<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="固件版本"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
      row-key="id"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary"
          v-auth="'three.firmware.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增固件版本')"
        >
          新增
        </el-button>
        <el-button
          v-auth="'three.firmware.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
      </template>
      <template #operation="{ row }">
        <el-button
          v-auth="'three.firmware.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑固件版本', row, false)"
        >
          编辑
        </el-button>
        <el-button
            v-auth="'three.firmware.remove'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <ThreeFirmwareForm ref="threeFirmwareRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  CirclePlus,
  Delete,
  EditPen,
} from '@element-plus/icons-vue'
import ProTable from '@/components/ProTable/index.vue'
import {
  createThreeFirmwareApi,
  removeThreeFirmwareApi,
  updateThreeFirmwareApi,
  getThreeFirmwareListApi,
  getThreeFirmwareDetailApi,
} from '@/api/modules/threefirmware/threeFirmware';
import { useHandleData } from '@/hooks/useHandleData';
import ThreeFirmwareForm from '@/views/threefirmware/threeFirmware/components/ThreeFirmwareForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IThreeFirmware } from '@/api/interface/threefirmware/threeFirmware';
defineOptions({
  name: 'ThreeFirmwareView'
})
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IThreeFirmware.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'version', label: '固件版本' },
  { prop: 'fileId', label: '关联的文件id' },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
]
// 搜索条件项
const searchColumns: SearchProps[] = [
  { prop: 'version', label: '固件版本', el: 'input' },
]
// 获取table列表
const getTableList = (params: IThreeFirmware.Query) => {
  let newParams = formatParams(params);
  return getThreeFirmwareListApi(newParams);
};
const formatParams = (params: IThreeFirmware.Query) =>{
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
const threeFirmwareRef = ref<InstanceType<typeof ThreeFirmwareForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getThreeFirmwareDetailApi({ id: row?.id })
    row = record?.data
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createThreeFirmwareApi : updateThreeFirmwareApi,
    getTableList: proTableRef.value?.getTableList
  }
  threeFirmwareRef.value?.acceptParams(params)
}
// 删除信息
const deleteInfo = async (params: IThreeFirmware.Row) => {
  await useHandleData(
    removeThreeFirmwareApi,
    { ids: [params.id] },
    `删除【${params.id}】固件版本`
  )
  proTableRef.value?.getTableList()
}
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeThreeFirmwareApi, { ids }, '删除所选固件版本')
  proTableRef.value?.clearSelection()
  proTableRef.value?.getTableList()
}
</script>