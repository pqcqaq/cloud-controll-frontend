<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="生成SN"
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
          v-auth="'one.gen.sn.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增生成SN')"
        >
          新增
        </el-button>
        <!-- <el-button
          v-auth="'one.gen.sn.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button> -->
      </template>
      <template #operation="{ row }">
        <!-- <el-button
          v-auth="'one.gen.sn.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑生成SN', row, false)"
        >
          编辑
        </el-button> -->
        <el-button
          v-auth="'one.gen.sn.remove'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <OneGenSnForm ref="oneGenSnRef" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { CirclePlus, Delete } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import { removeOneGenSnApi, getOneGenSnListApi, getOneGenSnDetailApi, printSnApi } from '@/api/modules/onegensn/oneGenSn';
import { useHandleData } from '@/hooks/useHandleData';
import OneGenSnForm from '@/views/onegensn/oneGenSn/components/OneGenSnForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IOneGenSn } from '@/api/interface/onegensn/oneGenSn';
import { ElMessage } from 'element-plus';
import mittBus from '@/utils/mittBus';
defineOptions({
  name: 'OneGenSnView'
});

const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IOneGenSn.Row>[] = [
  { type: 'selection', width: 80 },
  // { prop: 'categoryId', label: '类别ID' },
  { prop: 'name', label: '类别名称' },
  { prop: 'code', label: '生成的SN' },
  { prop: 'seq', label: '自增号' },
  // { prop: 'used', label: '是否已经使用' },
  { prop: 'produceTime', label: '生产日期' },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
];
// 搜索条件项
const searchColumns: SearchProps[] = [
  { prop: 'code', label: '生成的SN', el: 'input' },
  { prop: 'seq', label: '自增号', el: 'input' },
  {
    prop: 'produceTime',
    label: '生产日期',
    el: 'date-picker',
    span: 2,
    props: {
      type: 'datetimerange',
      valueFormat: 'YYYY-MM-DD HH:mm:ss'
    }
  }
];
// 获取table列表
const getTableList = (params: IOneGenSn.Query) => {
  let newParams = formatParams(params);
  return getOneGenSnListApi(newParams);
};
const formatParams = (params: IOneGenSn.Query) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.createTimeStart = newParams.createTime[0]);
  newParams.createTime && (newParams.createTimeEnd = newParams.createTime[1]);
  delete newParams.createTime;
  newParams.updateTime && (newParams.updateTimeStart = newParams.updateTime[0]);
  newParams.updateTime && (newParams.updateTimeEnd = newParams.updateTime[1]);
  delete newParams.updateTime;
  newParams.produceTime && (newParams.produceTimeStart = newParams.produceTime[0]);
  newParams.produceTime && (newParams.produceTimeEnd = newParams.produceTime[1]);
  delete newParams.produceTime;
  return newParams;
};
// 打开 drawer(新增、查看、编辑)
const oneGenSnRef = ref<InstanceType<typeof OneGenSnForm>>();
const openAddEdit = async (title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getOneGenSnDetailApi({ id: row?.id });
    row = record?.data;
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd
      ? printSnApi
      : () => {
          ElMessage.error('编辑功能暂未开放');
          return new Promise(() => {});
        },
    getTableList: proTableRef.value?.getTableList
  };
  oneGenSnRef.value?.acceptParams(params);
};
// 删除信息
const deleteInfo = async (params: IOneGenSn.Row) => {
  await useHandleData(removeOneGenSnApi, { ids: [params.id] }, `删除【${params.id}】生成SN`);
  proTableRef.value?.getTableList();
};
// // 批量删除信息
// const batchDelete = async (ids: (string | number)[]) => {
//   await useHandleData(removeOneGenSnApi, { ids }, '删除所选生成SN')
//   proTableRef.value?.clearSelection()
//   proTableRef.value?.getTableList()
// }

onMounted(() => {
  mittBus.on('socket.PRINT_ERROR', (data: any) => {
    switch (data.type) {
      case 'SN':
        proTableRef.value?.getTableList();
        break;
      default:
        break;
    }
  });
});
</script>
