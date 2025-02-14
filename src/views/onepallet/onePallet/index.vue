<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="栈板码"
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
          v-auth="'one.pallet.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增栈板码')"
        >
          新增
        </el-button>
        <el-button
          v-auth="'one.pallet.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
        <!-- <el-button
          v-auth="'one.pallet.import'"
          type="primary"
          :icon="Upload"
          plain
          @click="importData"
        >
          导入
        </el-button>
        <el-button
          v-auth="'one.pallet.export'"
          type="primary"
          :icon="Download"
          plain
          @click="downloadFile"
        >
          导出
        </el-button> -->
      </template>
      <template #operation="{ row }">
        <!-- <el-button
          v-auth="'one.pallet.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑栈板码', row, false)"
        >
          编辑
        </el-button> -->
        <el-button
          v-auth="'one.pallet.remove'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <OnePalletForm ref="oneRef" />
    <ImportExcel ref="ImportExcelRef" />
  </div>
</template>

<script setup lang="ts">
import { h, ref } from 'vue';
import { CirclePlus, Delete, EditPen, Upload, Download } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import {
  createOnePalletApi,
  removeOnePalletApi,
  updateOnePalletApi,
  getOnePalletListApi,
  getOnePalletDetailApi,
  importOnePalletExcelApi,
  exportOnePalletExcelApi,
  reprintPalletCodeApi
} from '@/api/modules/onepallet/one';
import { useHandleData } from '@/hooks/useHandleData';
import OnePalletForm from '@/views/onepallet/onePallet/components/OnePalletForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IOnePallet } from '@/api/interface/onepallet/one';
import ImportExcel from '@/components/ImportExcel/index.vue';
import { downloadTemplate } from '@/api/modules/system/common';
import { ElButton, ElMessageBox, ElTag } from 'element-plus';
import { useDownload } from '@/hooks/useDownload';
defineOptions({
  name: 'OnePalletView'
});
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IOnePallet.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'palletCode', label: '托盘号' },
  { prop: 'midBoxCodes', label: '中箱号' },
  {
    prop: 'printed',
    label: '是否打印成功',
    width: 100,
    render: ({ row }) => (row.printed ? h(ElTag, { type: 'success' }, ['是']) : h(ElTag, { type: 'danger' }, ['否']))
  },
  { prop: 'createTime', label: '创建时间', width: 200 },
  { prop: 'printedTime', label: '打印时间', width: 200 },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' },
  {
    prop: 'reprint',
    label: '补打',
    width: 90,
    render: ({ row }) => {
      return h(
        ElButton,
        {
          type: 'primary',
          onClick: () =>
            reprintPalletCodeApi({
              code: row.palletCode!
            }).then(res => {
              ElMessageBox.alert('补打成功', '提示', {
                confirmButtonText: '确定',
                type: 'success'
              });
            })
        },
        ['补打']
      );
    }
  }
];
// 搜索条件项
const searchColumns: SearchProps[] = [
  { prop: 'midBoxCode', label: '中箱号', el: 'input' },
  {
    prop: 'createTime',
    label: '创建时间',
    el: 'date-picker',
    props: {
      type: 'daterange'
    }
  },
  { prop: 'palletCode', label: '托盘号', el: 'input' } // 日期内
];
// 获取table列表
const getTableList = (params: IOnePallet.Query) => {
  let newParams = formatParams(params);
  return getOnePalletListApi(newParams);
};
const formatParams = (params: IOnePallet.Query) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.createTimeStart = newParams.createTime[0]);
  newParams.createTime && (newParams.createTimeEnd = newParams.createTime[1]);
  delete newParams.createTime;
  newParams.updateTime && (newParams.updateTimeStart = newParams.updateTime[0]);
  newParams.updateTime && (newParams.updateTimeEnd = newParams.updateTime[1]);
  delete newParams.updateTime;
  return newParams;
};
// 打开 drawer(新增、查看、编辑)
const oneRef = ref<InstanceType<typeof OnePalletForm>>();
const openAddEdit = async (title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getOnePalletDetailApi({ id: row?.id });
    row = record?.data;
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createOnePalletApi : updateOnePalletApi,
    getTableList: proTableRef.value?.getTableList
  };
  oneRef.value?.acceptParams(params);
};
// 删除信息
const deleteInfo = async (params: IOnePallet.Row) => {
  await useHandleData(removeOnePalletApi, { ids: [params.id] }, `删除【${params.id}】栈板码`);
  proTableRef.value?.getTableList();
};
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeOnePalletApi, { ids }, '删除所选栈板码');
  proTableRef.value?.clearSelection();
  proTableRef.value?.getTableList();
};
// 导入
const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>();
const importData = () => {
  const params = {
    title: '栈板码',
    templateName: '栈板码',
    tempApi: downloadTemplate,
    importApi: importOnePalletExcelApi,
    getTableList: proTableRef.value?.getTableList
  };
  ImportExcelRef.value?.acceptParams(params);
};
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as IOnePallet.Query);
  useDownload(exportOnePalletExcelApi, '栈板码', newParams);
};
</script>
