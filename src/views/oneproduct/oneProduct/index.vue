<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="产品SN"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
      row-key="id"
      :search-col="4"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <!-- <el-button
          type="primary"
          v-auth="'one.product.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增产品SN')"
        >
          新增
        </el-button> -->
        <el-button
          v-auth="'one.product.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
        <!-- <el-button
          v-auth="'one.product.import'"
          type="primary"
          :icon="Upload"
          plain
          @click="importData"
        >
          导入
        </el-button> -->
        <el-button
          v-auth="'one.product.export'"
          type="primary"
          :icon="Download"
          plain
          @click="downloadFile"
        >
          导出
        </el-button>
      </template>
      <template #operation="{ row }">
        <!-- <el-button
          v-auth="'one.product.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑产品SN', row, false)"
        >
          编辑
        </el-button> -->
        <el-button
          v-auth="'one.product.remove'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <OneProductForm ref="oneRef" />
    <ImportExcel ref="ImportExcelRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, h, onMounted, onUnmounted } from 'vue';
import { Delete, Download } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import {
  // createOneProductApi,
  removeOneProductApi,
  // updateOneProductApi,
  getOneProductListApi,
  // getOneProductDetailApi,
  // importOneProductExcelApi,
  exportOneProductExcelApi,
  reprintOneProductApi
} from '@/api/modules/oneproduct/one';
import { useHandleData } from '@/hooks/useHandleData';
import OneProductForm from '@/views/oneproduct/oneProduct/components/OneProductForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IOneProduct } from '@/api/interface/oneproduct/one';
import ImportExcel from '@/components/ImportExcel/index.vue';
// import { downloadTemplate } from '@/api/modules/system/common';
import { useDownload } from '@/hooks/useDownload';
import { ElButton, ElMessage, ElMessageBox, ElTag, ElTooltip } from 'element-plus';
import { getOneAssemblyLineSelectionApi } from '@/api/modules/oneassemblyline/oneAssemblyLine';
import mittBus from '@/utils/mittBus';
defineOptions({
  name: 'OneProductView'
});
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IOneProduct.Row>[] = [
  { type: 'selection', width: 80 },
  {
    prop: 'code',
    label: 'SN码',
    width: 220,
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
  { prop: 'categoryName', label: '类别名称' },
  // {
  //   prop: 'printed',
  //   label: '是否打印成功',
  //   width: 100,
  //   render: ({ row }) => (row.printed ? h(ElTag, { type: 'success' }, ['是']) : h(ElTag, { type: 'danger' }, ['否']))
  // },
  {
    prop: 'printedTime',
    label: '打印时间',
    width: 160,
    render: ({ row }) => {
      return row.printedTime ? row.printedTime : h(ElTag, { type: 'danger' }, ['未打印']);
    }
  },
  {
    prop: 'assemblyLineName',
    label: '产线名称'
  },
  {
    prop: 'weight',
    label: '重量',
    width: 100,
    render: ({ row }) => {
      return row.weight ? row.weight + 'g' : h(ElTag, { type: 'danger' }, ['未称重']);
    }
  },
  {
    prop: 'weighTime',
    label: '称重时间',
    width: 160
  },
  {
    prop: 'midBoxTime',
    label: '中箱打包时间',
    width: 160,
    render: ({ row }) => {
      return row.midBoxTime ? row.midBoxTime : h(ElTag, { type: 'danger' }, ['未打包']);
    }
  },
  { prop: 'operation', label: '操作', width: 120, fixed: 'right' },
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
            reprintOneProductApi(row).then(() => {
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
const searchColumns = ref<SearchProps[]>([
  // 筛选产线
  {
    prop: 'assemblyLineId',
    label: '产线',
    el: 'select',
    enum: [],
  },
  {
    prop: 'printedTime',
    label: '打印时间',
    el: 'date-picker',
    props: {
      type: 'daterange'
    }
  },
  { prop: 'code', label: 'SN码', el: 'input' }
  // { prop: 'categoryId', label: '类别信息', el: 'input' },
  // 日期内
]);

// 获取table列表
const getTableList = (params: IOneProduct.Query) => {
  let newParams = formatParams(params);
  return getOneProductListApi(newParams);
};
const getSelection = () => {
  getOneAssemblyLineSelectionApi().then(res => {
    searchColumns.value = searchColumns.value.map(item => {
      if (item.prop === 'assemblyLineId') {
        item.enum = res.data.map(item => {
          return {
            label: item.label,
            value: item.id
          };
        });
      }
      return item;
    });
  });
};
onMounted(() => {
  getSelection();
  proTableRef.value?.searchInitParam;
});
const formatParams = (params: IOneProduct.Query) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.printedTime && (newParams.printedTimeStart = newParams.printedTime[0]);
  newParams.printedTime && (newParams.printedTimeEnd = newParams.printedTime[1]);
  delete newParams.printedTime;
  newParams.createTime && (newParams.createTimeStart = newParams.createTime[0]);
  newParams.createTime && (newParams.createTimeEnd = newParams.createTime[1]);
  delete newParams.createTime;
  newParams.updateTime && (newParams.updateTimeStart = newParams.updateTime[0]);
  newParams.updateTime && (newParams.updateTimeEnd = newParams.updateTime[1]);
  delete newParams.updateTime;
  return newParams;
};
// 打开 drawer(新增、查看、编辑)
const oneRef = ref<InstanceType<typeof OneProductForm>>();
// const openAddEdit = async (title: string, row: any = {}, isAdd = true) => {
//   if (!isAdd) {
//     const record = await getOneProductDetailApi({ id: row?.id });
//     row = record?.data;
//   }
//   const params = {
//     title,
//     row: { ...row },
//     api: isAdd ? createOneProductApi : updateOneProductApi,
//     getTableList: proTableRef.value?.getTableList
//   };
//   oneRef.value?.acceptParams(params);
// };
// 删除信息
const deleteInfo = async (params: IOneProduct.Row) => {
  await useHandleData(removeOneProductApi, { ids: [params.id] }, `删除【${params.id}】产品SN`);
  proTableRef.value?.getTableList();
};
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeOneProductApi, { ids }, '删除所选产品SN');
  proTableRef.value?.clearSelection();
  proTableRef.value?.getTableList();
};
// 导入
const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>();
// const importData = () => {
//   const params = {
//     title: '产品SN',
//     templateName: '产品SN',
//     tempApi: downloadTemplate,
//     importApi: importOneProductExcelApi,
//     getTableList: proTableRef.value?.getTableList
//   };
//   ImportExcelRef.value?.acceptParams(params);
// };
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as IOneProduct.Query);
  useDownload(exportOneProductExcelApi, '产品SN', newParams);
};

const hasAnyValue = (obj: any) => {
  return Object.values(obj).some(item => item);
};

const eventHandler = (data: any) => {
  if (hasAnyValue(proTableRef.value?.searchParam)) {
    return;
  }
  switch (data.type) {
    case 'PRODUCT':
      proTableRef.value?.getTableList();
      break;
    default:
      break;
  }
};
onMounted(() => {
  mittBus.on('socket.NEW_PRINT', eventHandler);
});

onUnmounted(() => {
  mittBus.off('socket.NEW_PRINT', eventHandler);
});
</script>
