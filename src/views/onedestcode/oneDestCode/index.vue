<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="目的地码生成列表"
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
          v-auth="'one.dest.code.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增目的地码生成列表')"
        >
          新增
        </el-button>
        <el-button
          v-auth="'one.dest.code.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
        <!-- <el-button
          v-auth="'one.dest.code.import'"
          type="primary"
          :icon="Upload"
          plain
          @click="importData"
        >
          导入
        </el-button>
        <el-button
          v-auth="'one.dest.code.export'"
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
          v-auth="'one.dest.code.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑目的地码生成列表', row, false)"
        >
          编辑
        </el-button> -->
        <el-button
          v-auth="'one.dest.code.remove'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <OneDestCodeForm ref="oneDestCodeRef" />
    <ImportExcel ref="ImportExcelRef" />
  </div>
</template>

<script setup lang="ts">
import { h, ref } from 'vue';
import { CirclePlus, Delete, EditPen, Upload, Download } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import {
  createOneDestCodeApi,
  removeOneDestCodeApi,
  updateOneDestCodeApi,
  getOneDestCodeListApi,
  getOneDestCodeDetailApi,
  importOneDestCodeExcelApi,
  exportOneDestCodeExcelApi,
  reprintOneDestCodeApi
} from '@/api/modules/onedestcode/oneDestCode';
import { useHandleData } from '@/hooks/useHandleData';
import OneDestCodeForm from '@/views/onedestcode/oneDestCode/components/OneDestCodeForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IOneDestCode } from '@/api/interface/onedestcode/oneDestCode';
import ImportExcel from '@/components/ImportExcel/index.vue';
import { downloadTemplate } from '@/api/modules/system/common';
import { ElButton, ElMessage, ElMessageBox, ElTag, ElTooltip } from 'element-plus';
import { useDownload } from '@/hooks/useDownload';
import { exportVProductShippingInfoCompleteExcelApi } from '@/api/modules/vproductshippinginfocomplete/vProductShippingInfoComplete';
defineOptions({
  name: 'OneDestCodeView'
});
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IOneDestCode.Row>[] = [
  { type: 'selection', width: 80 },
  {
    prop: 'code',
    label: '目的地码',
    render: ({ row }) => {
      return h(
        ElTooltip,
        {
          content: '点击复制',
          effect: 'light'
        },
        {
          default: () =>
            h(
              'span',
              {
                style: {
                  cursor: 'pointer',
                  color: '#409EFF'
                },
                onClick: () => {
                  // 复制到剪贴板
                  navigator.clipboard
                    .writeText(row.code!)
                    .then(() => {
                      ElMessage.success('复制成功');
                    })
                    .catch(() => {
                      ElMessage.error('复制失败');
                    });
                }
              },
              row.code
            )
        }
      );
    }
  },
  // address
  { prop: 'address', label: '地址', width: 200 },
  // createTime
  { prop: 'createTime', label: '创建时间', width: 200 },
  {
    prop: 'printed',
    label: '是否打印成功',
    width: 100,
    render: ({ row }) => (row.printed ? h(ElTag, { type: 'success' }, ['是']) : h(ElTag, { type: 'danger' }, ['否']))
  },
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
            reprintOneDestCodeApi({
              id: row.id!
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
  },
  // 导出按钮
  {
    prop: 'export',
    label: '导出',
    width: 90,
    render: ({ row }) => {
      return h(
        ElButton,
        {
          type: 'primary',
          onClick: () => {
            useDownload(() => {
              return exportVProductShippingInfoCompleteExcelApi({
                destCode: row.code!,
                page: 1,
                limit: 99999
              })
            }, '目的地码生成列表', { id: row.id });
          }
        },
        ['导出']
      );
    }
  }
];
// 搜索条件项
const searchColumns: SearchProps[] = [
  { prop: 'code', label: '目的地码', el: 'input' },
  { prop: 'printed', label: '是否打印', el: 'input' }
];
// 获取table列表
const getTableList = (params: IOneDestCode.Query) => {
  let newParams = formatParams(params);
  return getOneDestCodeListApi(newParams);
};
const formatParams = (params: IOneDestCode.Query) => {
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
const oneDestCodeRef = ref<InstanceType<typeof OneDestCodeForm>>();
const openAddEdit = async (title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getOneDestCodeDetailApi({ id: row?.id });
    row = record?.data;
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createOneDestCodeApi : updateOneDestCodeApi,
    getTableList: proTableRef.value?.getTableList
  };
  oneDestCodeRef.value?.acceptParams(params);
};
// 删除信息
const deleteInfo = async (params: IOneDestCode.Row) => {
  await useHandleData(removeOneDestCodeApi, { ids: [params.id] }, `删除【${params.id}】目的地码生成列表`);
  proTableRef.value?.getTableList();
};
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeOneDestCodeApi, { ids }, '删除所选目的地码生成列表');
  proTableRef.value?.clearSelection();
  proTableRef.value?.getTableList();
};
// 导入
const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>();
const importData = () => {
  const params = {
    title: '目的地码生成列表',
    templateName: '目的地码生成列表',
    tempApi: downloadTemplate,
    importApi: importOneDestCodeExcelApi,
    getTableList: proTableRef.value?.getTableList
  };
  ImportExcelRef.value?.acceptParams(params);
};
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as IOneDestCode.Query);
  useDownload(exportOneDestCodeExcelApi, '目的地码生成列表', newParams);
};
</script>
