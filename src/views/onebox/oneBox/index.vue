<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="中箱号"
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
          v-auth="'one.box.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增中箱号')"
        >
          新增
        </el-button> -->
        <el-button
          v-auth="'one.box.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
        <!-- <el-button
          v-auth="'one.box.import'"
          type="primary"
          :icon="Upload"
          plain
          @click="importData"
        >
          导入
        </el-button> -->
        <el-button v-auth="'one.box.export'" type="primary" :icon="Download" plain @click="downloadFile"> 导出 </el-button>
      </template>
      <template #operation="{ row }">
        <!-- <el-button
          v-auth="'one.box.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑产线一', row, false)"
        >
          编辑
        </el-button> -->
        <el-button v-auth="'one.box.remove'" type="primary" link :icon="Delete" @click="deleteInfo(row)"> 删除 </el-button>
      </template>
    </ProTable>
    <OneBoxForm ref="oneRef" />
    <!-- <ImportExcel ref="ImportExcelRef" /> -->
  </div>
</template>

<script setup lang="ts">
import { h, onMounted, onUnmounted, ref } from 'vue';
import { Delete, Download } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import { removeOneBoxApi, getOneBoxListApi, exportOneBoxExcelApi, reprintMidCodeApi } from '@/api/modules/onebox/one';
import { useHandleData } from '@/hooks/useHandleData';
import OneBoxForm from '@/views/onebox/oneBox/components/OneBoxForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IOneBox } from '@/api/interface/onebox/one';
// import ImportExcel from '@/components/ImportExcel/index.vue';
import { ElMessageBox, ElButton, ElTag, ElTooltip, ElMessage } from 'element-plus';
import { useDownload } from '@/hooks/useDownload';
import mittBus from '@/utils/mittBus';
defineOptions({
  name: 'OneBoxView'
});
const proTableRef = ref<ProTableInstance>();
const handleRePrint = async (row: IOneBox.Row) => {
  await reprintMidCodeApi({
    code: row.midBoxCode!
  }).then(() => {
    ElMessageBox.alert('补打成功', '提示', {
      confirmButtonText: '确定',
      type: 'success'
    });
  });
};
// 表格配置项
const columns: ColumnProps<IOneBox.Row>[] = [
  { type: 'selection', width: 80 },
  {
    prop: 'midBoxCode',
    label: '中箱号',
    width: 260,
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
                    .writeText(row.midBoxCode!)
                    .then(() => {
                      ElMessage.success('复制成功');
                    })
                    .catch(() => {
                      ElMessage.error('复制失败');
                    });
                }
              },
              row.midBoxCode
            )
        }
      );
    }
  },
  { prop: 'createTime', label: '创建时间', width: 200 },
  { prop: 'snCodes', label: 'SN码' },
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
    prop: 'palletTime',
    label: '栈板打包时间',
    width: 160,
    render: ({ row }) => {
      return row.palletTime ? row.palletTime : h(ElTag, { type: 'danger' }, ['未打包']);
    }
  },
  { prop: 'operation', label: '操作', width: 100, fixed: 'right' },
  {
    prop: 'reprint',
    label: '补打',
    width: 90,
    render: ({ row }) => {
      return h(
        ElButton,
        {
          type: 'primary',
          onClick: () => handleRePrint(row)
        },
        ['补打']
      );
    }
  }
];
// 搜索条件项
const searchColumns: SearchProps[] = [
  { prop: 'snCode', label: 'SN号码', el: 'input' },
  // 日期内
  {
    prop: 'createTime',
    label: '创建时间',
    el: 'date-picker',
    props: {
      type: 'daterange'
    }
  },
  { prop: 'midBoxCode', label: '中箱号', el: 'input' },
  { prop: 'seq', label: '序列号', el: 'input-number' }
];
// 获取table列表
const getTableList = (params: IOneBox.Query) => {
  let newParams = formatParams(params);
  return getOneBoxListApi(newParams);
};
const formatParams = (params: IOneBox.Query) => {
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
const oneRef = ref<InstanceType<typeof OneBoxForm>>();
// const openAddEdit = async (title: string, row: any = {}, isAdd = true) => {
//   if (!isAdd) {
//     const record = await getOneBoxDetailApi({ id: row?.id });
//     row = record?.data;
//   }
//   const params = {
//     title,
//     row: { ...row },
//     api: isAdd ? createOneBoxApi : updateOneBoxApi,
//     getTableList: proTableRef.value?.getTableList
//   };
//   oneRef.value?.acceptParams(params);
// };
// 删除信息
const deleteInfo = async (params: IOneBox.Row) => {
  await useHandleData(removeOneBoxApi, { ids: [params.id] }, `删除【${params.id}】中箱号`);
  proTableRef.value?.getTableList();
};
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeOneBoxApi, { ids }, '删除所选中箱号');
  proTableRef.value?.clearSelection();
  proTableRef.value?.getTableList();
};
// 导入
// const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>();
// const importData = () => {
//   const params = {
//     title: '中箱号',
//     templateName: '中箱号',
//     tempApi: downloadTemplate,
//     importApi: importOneBoxExcelApi,
//     getTableList: proTableRef.value?.getTableList
//   };
//   ImportExcelRef.value?.acceptParams(params);
// };
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as IOneBox.Query);
  useDownload(exportOneBoxExcelApi, '中箱号', newParams);
};

const hasAnyValue = (obj: any) => {
  return Object.values(obj).some(item => item);
};

const eventHandler = (data: any) => {
  if (hasAnyValue(proTableRef.value?.searchParam)) {
    return;
  }
  switch (data.type) {
    case 'MID_BOX':
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
