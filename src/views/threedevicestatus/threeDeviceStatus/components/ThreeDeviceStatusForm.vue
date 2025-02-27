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
      <el-form-item label="采集器ID" prop="collectorId">
        <el-input-number
          v-model="paramsProps.row.collectorId" :precision="0" :min="1" :max="999999" />
      </el-form-item>
      <el-form-item label="信号强度" prop="signalStrength">
        <el-input-number
          v-model="paramsProps.row.signalStrength" :precision="0" :min="1" :max="999999" />
      </el-form-item>
      <el-form-item label="采集器电压" prop="voltage">
        <el-input-number
          v-model="paramsProps.row.voltage" :precision="0" :min="1" :max="999999" />
      </el-form-item>
      <el-form-item label="温度" prop="temperature">
        <el-input-number
          v-model="paramsProps.row.temperature" :precision="0" :min="1" :max="999999" />
      </el-form-item>
      <el-form-item label="本次在线时间" prop="uptime">
        <el-input-number
          v-model="paramsProps.row.uptime" :precision="0" :min="1" :max="999999" />
      </el-form-item>
      <el-form-item label="纬度" prop="posLat">
        <el-input-number
          v-model="paramsProps.row.posLat" :precision="0" :min="1" :max="999999" />
      </el-form-item>
      <el-form-item label="经度" prop="posLon">
        <el-input-number
          v-model="paramsProps.row.posLon" :precision="0" :min="1" :max="999999" />
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
    name: 'ThreeDeviceStatusForm'
})

const rules = reactive({
  delFlag: [{ required: true, message: '请填写删除与否' }],
  collectorId: [{ required: true, message: '请填写采集器ID' }],
  signalStrength: [{ required: true, message: '请填写信号强度' }],
  voltage: [{ required: true, message: '请填写采集器电压' }],
  temperature: [{ required: true, message: '请填写温度' }],
  uptime: [{ required: true, message: '请填写本次在线时间' }],
  posLat: [{ required: true, message: '请填写纬度' }],
  posLon: [{ required: true, message: '请填写经度' }],
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