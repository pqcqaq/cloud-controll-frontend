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
      <el-form-item label="第几个输入DI" prop="pinDef">
        <el-input-number
          v-model="paramsProps.row.pinDef" :precision="0" :min="1" :max="999999" />
      </el-form-item>
      <el-form-item label="触发次数" prop="counts">
        <el-input-number
          v-model="paramsProps.row.counts" :precision="0" :min="1" :max="999999" />
      </el-form-item>
      <el-form-item label="上一次触发时间" prop="triggerTime">
        <el-date-picker clearable
          v-model="paramsProps.row.triggerTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择上一次触发时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="触发累计时长" prop="uptime">
        <el-input-number
          v-model="paramsProps.row.uptime" :precision="0" :min="1" :max="999999" />
      </el-form-item>
      <el-form-item label="当前是否有效" prop="active">
        <el-input-number
          v-model="paramsProps.row.active" :precision="0" :min="1" :max="999999" />
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
    name: 'ThreePinStatusForm'
})

const rules = reactive({
  delFlag: [{ required: true, message: '请填写删除与否' }],
  collectorId: [{ required: true, message: '请填写采集器ID' }],
  pinDef: [{ required: true, message: '请填写第几个输入DI' }],
  counts: [{ required: true, message: '请填写触发次数' }],
  triggerTime: [{ required: true, message: '请填写上一次触发时间' }],
  uptime: [{ required: true, message: '请填写触发累计时长' }],
  active: [{ required: true, message: '请填写当前是否有效' }],
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