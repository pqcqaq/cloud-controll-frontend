<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="VIEW"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
      row-key="product_sn_code"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <!-- <el-button type="primary"
          v-auth="'v.product.shipping.info.complete.create'"
          :icon="CirclePlus"
          @click="openAddEdit('新增VIEW')"
        >
          新增
        </el-button> -->
        <!-- <el-button
          v-auth="'v.product.shipping.info.complete.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button> -->
        <el-button
          v-auth="'v.product.shipping.info.complete.export'"
          type="primary"
          :icon="Download"
          plain
          @click="downloadFile"
        >
          导出
        </el-button>
      </template>
      <!-- <template #operation="{ row }"> -->
      <!-- <el-button
          v-auth="'v.product.shipping.info.complete.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑VIEW', row, false)"
        >
          编辑
        </el-button>
        <el-button
            v-auth="'v.product.shipping.info.complete.remove'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button> -->
      <!-- </template> -->
    </ProTable>
    <!-- <VProductShippingInfoCompleteForm ref="vProductShippingInfoCompleteRef" /> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  // CirclePlus,
  // Delete,
  // EditPen,
  Download
} from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import {
  // createVProductShippingInfoCompleteApi,
  // removeVProductShippingInfoCompleteApi,
  // updateVProductShippingInfoCompleteApi,
  getVProductShippingInfoCompleteListApi,
  // getVProductShippingInfoCompleteDetailApi,
  exportVProductShippingInfoCompleteExcelApi
} from '@/api/modules/vproductshippinginfocomplete/vProductShippingInfoComplete';
// import { useHandleData } from '@/hooks/useHandleData';
// import VProductShippingInfoCompleteForm from '@/views/vproductshippinginfocomplete/vProductShippingInfoComplete/components/VProductShippingInfoCompleteForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IVProductShippingInfoComplete } from '@/api/interface/vproductshippinginfocomplete/vProductShippingInfoComplete';
// import { ElMessageBox } from "element-plus";
import { useDownload } from '@/hooks/useDownload';
defineOptions({
  name: 'VProductShippingInfoCompleteView'
});
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IVProductShippingInfoComplete.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'productName', label: '产品名称', width: 200 },
  { prop: 'productSku', label: '产品SKU', width: 120 },
  { prop: 'productId', label: '产品ID标识', width: 120 },
  { prop: 'productSnCode', label: '产品SN码', width: 200 },
  { prop: 'packingFormat', label: '装托数量', width: 120 },
  { prop: 'orderNumber', label: '订单号', width: 120 },
  { prop: 'midBoxNumber', label: '中箱号', width: 250 },
  { prop: 'destination', label: '发货地址', width: 120 },
  // { prop: 'destCodeId', label: '目的地码ID', width: 120 },
  { prop: 'palletNumber', label: '托盘号', width: 250 },
  { prop: 'factoryDate', label: '出厂日期', width: 120 },
  { prop: 'productionDate', label: '生产日期', width: 120 },
  { prop: 'destCode', label: '目的地码', width: 250 },
  { prop: 'totalShippingQuantity', label: '发货总量', width: 120 },
  { prop: 'totalPalletQuantity', label: '栈板数总量', width: 120 }
  // { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
];
// 搜索条件项
const searchColumns: SearchProps[] = [
  // { prop: 'productName', label: '产品名称', el: 'input' },
  // { prop: 'productSku', label: '产品SKU', el: 'input' },
  // { prop: 'productId', label: '产品ID标识', el: 'input' },
  { prop: 'destCode', label: '目的地码', el: 'input' },
  { prop: 'orderNumber', label: '订单号', el: 'input' },
  { prop: 'productSnCode', label: '产品SN码', el: 'input' },
  // { prop: 'packingFormat', label: '装托数量', el: 'input' },
  { prop: 'midBoxNumber', label: '中箱号', el: 'input' },
  { prop: 'destination', label: '发货地址', el: 'input' },
  // { prop: 'destCodeId', label: '目的地码ID', el: 'input' },
  { prop: 'palletNumber', label: '托盘号', el: 'input' },
  { prop: 'factoryDate', label: '出厂日期', el: 'input' },
  { prop: 'productionDate', label: '生产日期', el: 'input' },
  // { prop: 'totalShippingQuantity', label: '发货总量', el: 'input' },
  // { prop: 'totalPalletQuantity', label: '栈板数总量', el: 'input' },
];
// 获取table列表
const getTableList = (params: IVProductShippingInfoComplete.Query) => {
  let newParams = formatParams(params);
  return getVProductShippingInfoCompleteListApi(newParams);
};
const formatParams = (params: IVProductShippingInfoComplete.Query) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.factoryDate && (newParams.factoryDateStart = newParams.factoryDate[0]);
  newParams.factoryDate && (newParams.factoryDateEnd = newParams.factoryDate[1]);
  delete newParams.factoryDate;
  newParams.productionDate && (newParams.productionDateStart = newParams.productionDate[0]);
  newParams.productionDate && (newParams.productionDateEnd = newParams.productionDate[1]);
  delete newParams.productionDate;
  return newParams;
};
// 打开 drawer(新增、查看、编辑)
// const vProductShippingInfoCompleteRef = ref<InstanceType<typeof VProductShippingInfoCompleteForm>>()
// const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
//   if (!isAdd) {
//     const record = await getVProductShippingInfoCompleteDetailApi({ id: row?. })
//     row = record?.data
//   }
//   const params = {
//     title,
//     row: { ...row },
//     api: isAdd ? createVProductShippingInfoCompleteApi : updateVProductShippingInfoCompleteApi,
//     getTableList: proTableRef.value?.getTableList
//   }
//   vProductShippingInfoCompleteRef.value?.acceptParams(params)
// }
// // 删除信息
// const deleteInfo = async (params: IVProductShippingInfoComplete.Row) => {
//   await useHandleData(
//     removeVProductShippingInfoCompleteApi,
//     { ids: [params.] },
//     `删除【${params.}】VIEW`
//   )
//   proTableRef.value?.getTableList()
// }
// // 批量删除信息
// const batchDelete = async (ids: (string | number)[]) => {
//   await useHandleData(removeVProductShippingInfoCompleteApi, { ids }, '删除所选VIEW')
//   proTableRef.value?.clearSelection()
//   proTableRef.value?.getTableList()
// }
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as IVProductShippingInfoComplete.Query);
  useDownload(exportVProductShippingInfoCompleteExcelApi, 'VIEW', newParams);
};
</script>
