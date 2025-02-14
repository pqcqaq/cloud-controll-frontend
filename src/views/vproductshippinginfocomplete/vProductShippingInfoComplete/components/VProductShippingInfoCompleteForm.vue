<template>
  <el-dialog
    v-model="visible"
    :title="`${paramsProps.title}`"
    :destroy-on-close="true"
    width="580px"
    draggable
  >
    <el-form
      ref="ruleFormRef"
      label-width="140px"
      label-suffix=" :"
      :rules="rules"
      :model="paramsProps.row"
      @submit.enter.prevent="handleSubmit"
    >
      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="paramsProps.row.productName"
          placeholder="请填写产品名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="产品SKU" prop="productSku">
        <el-input
          v-model="paramsProps.row.productSku"
          placeholder="请填写产品SKU"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="产品ID标识" prop="productId">
        <el-input-number
          v-model="paramsProps.row.productId" :precision="0" :min="1" :max="999999" />
      </el-form-item>
      <el-form-item label="产品SN码" prop="productSnCode">
        <el-input
          v-model="paramsProps.row.productSnCode"
          placeholder="请填写产品SN码"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="装托数量" prop="packingFormat">
        <el-input
          v-model="paramsProps.row.packingFormat"
          placeholder="请填写装托数量"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="订单号" prop="orderNumber">
        <el-input
          v-model="paramsProps.row.orderNumber"
          placeholder="请填写订单号"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="中箱号" prop="midBoxNumber">
        <el-input
          v-model="paramsProps.row.midBoxNumber"
          placeholder="请填写中箱号"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="发货地址" prop="destination">
        <el-input
          v-model="paramsProps.row.destination"
          placeholder="请填写发货地址"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="目的地码ID" prop="destCodeId">
        <el-input-number
          v-model="paramsProps.row.destCodeId" :precision="0" :min="1" :max="999999" />
      </el-form-item>
      <el-form-item label="托盘号" prop="palletNumber">
        <el-input
          v-model="paramsProps.row.palletNumber"
          placeholder="请填写托盘号"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="出厂日期" prop="factoryDate">
        <el-date-picker clearable
          v-model="paramsProps.row.factoryDate"
          type="date"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择出厂日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="解码后的产品码中的时间" prop="productionDate">
        <el-date-picker clearable
          v-model="paramsProps.row.productionDate"
          type="date"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择解码后的产品码中的时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="目的地码" prop="destCode">
        <el-input
          v-model="paramsProps.row.destCode"
          placeholder="请填写目的地码"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="发货总量" prop="totalShippingQuantity">
        <el-input-number
          v-model="paramsProps.row.totalShippingQuantity" :precision="0" :min="1" :max="999999" />
      </el-form-item>
      <el-form-item label="栈板数总量" prop="totalPalletQuantity">
        <el-input-number
          v-model="paramsProps.row.totalPalletQuantity" :precision="0" :min="1" :max="999999" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false"> 取消</el-button>
      <el-button type="primary" @click="handleSubmit"> 确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { type ElForm, ElMessage } from 'element-plus'

defineOptions({
    name: 'VProductShippingInfoCompleteForm'
})

const rules = reactive({
  productName: [{ required: true, message: '请填写产品名称' }],
  productSku: [{ required: true, message: '请填写产品SKU' }],
  productId: [{ required: true, message: '请填写产品ID标识' }],
  productSnCode: [{ required: true, message: '请填写产品SN码' }],
  packingFormat: [{ required: true, message: '请填写装托数量' }],
  productionDate: [{ required: true, message: '请填写解码后的产品码中的时间' }],
})

const visible = ref(false)
const paramsProps = ref<View.DefaultParams>({
  title: '',
  row: {},
  api: undefined,
  getTableList: undefined
})

// 接收父组件传过来的参数
const acceptParams = (params: View.DefaultParams) => {
  paramsProps.value = params
  visible.value = true
}

// 提交数据（新增/编辑）
const ruleFormRef = ref<InstanceType<typeof ElForm>>()
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return
    try {
      await paramsProps.value.api!(paramsProps.value.row)
      ElMessage.success({ message: `${paramsProps.value.title}成功！` })
      paramsProps.value.getTableList!()
      visible.value = false
    } catch (error) {
      console.log(error)
    }
  })
}

defineExpose({
  acceptParams
})
</script>

<style scoped lang="scss"></style>