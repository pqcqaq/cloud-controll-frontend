<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="全局自增信息"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
      row-key="id"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary"
          v-auth="'one.seq.number.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增全局自增信息')"
        >
          新增
        </el-button>
        <el-button
          v-auth="'one.seq.number.remove'"
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
          v-auth="'one.seq.number.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑全局自增信息', row, false)"
        >
          编辑
        </el-button>
        <el-button
            v-auth="'one.seq.number.remove'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <OneSeqNumberForm ref="oneSeqNumberRef" />
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
  createOneSeqNumberApi,
  removeOneSeqNumberApi,
  updateOneSeqNumberApi,
  getOneSeqNumberListApi,
  getOneSeqNumberDetailApi,
} from '@/api/modules/oneseqnumber/oneSeqNumber';
import { useHandleData } from '@/hooks/useHandleData';
import OneSeqNumberForm from '@/views/oneseqnumber/oneSeqNumber/components/OneSeqNumberForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IOneSeqNumber } from '@/api/interface/oneseqnumber/oneSeqNumber';
defineOptions({
  name: 'OneSeqNumberView'
})
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IOneSeqNumber.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'key', label: '自增Key' },
  { prop: 'value', label: '自增值' },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
]
// 搜索条件项
const searchColumns: SearchProps[] = [
  { prop: 'createTime',
    label: '创建时间',
    el: 'date-picker',
    span: 2,
    props: {
      type: "datetimerange",
      valueFormat: "YYYY-MM-DD HH:mm:ss"
    },
  },
  { prop: 'updateTime',
    label: '更新时间',
    el: 'date-picker',
    span: 2,
    props: {
      type: "datetimerange",
      valueFormat: "YYYY-MM-DD HH:mm:ss"
    },
  },
  { prop: 'key', label: '自增Key', el: 'input' },
]
// 获取table列表
const getTableList = (params: IOneSeqNumber.Query) => {
  let newParams = formatParams(params);
  return getOneSeqNumberListApi(newParams);
};
const formatParams = (params: IOneSeqNumber.Query) =>{
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
const oneSeqNumberRef = ref<InstanceType<typeof OneSeqNumberForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getOneSeqNumberDetailApi({ id: row?.id })
    row = record?.data
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createOneSeqNumberApi : updateOneSeqNumberApi,
    getTableList: proTableRef.value?.getTableList
  }
  oneSeqNumberRef.value?.acceptParams(params)
}
// 删除信息
const deleteInfo = async (params: IOneSeqNumber.Row) => {
  await useHandleData(
    removeOneSeqNumberApi,
    { ids: [params.id] },
    `删除【${params.id}】全局自增信息`
  )
  proTableRef.value?.getTableList()
}
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeOneSeqNumberApi, { ids }, '删除所选全局自增信息')
  proTableRef.value?.clearSelection()
  proTableRef.value?.getTableList()
}
</script>