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
      <el-form-item label="总计在线时间" prop="uptime">
        <el-input-number
          v-model="paramsProps.row.uptime" :precision="0" :min="1" :max="999999" />
      </el-form-item>
      <el-form-item label="统计的时间" prop="countDate">
        <el-date-picker clearable
          v-model="paramsProps.row.countDate"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择统计的时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="24小时内的开启时间" prop="hours">
        <el-input-number
          v-model="paramsProps.row.hours" :precision="0" :min="1" :max="999999" />
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
    name: 'ThreeCollectorUptimeForm'
})

const rules = reactive({
  createTime: [{ required: true, message: '请填写创建时间' }],
  createId: [{ required: true, message: '请填写创建人ID' }],
  delFlag: [{ required: true, message: '请填写删除与否' }],
  uptime: [{ required: true, message: '请填写总计在线时间' }],
  countDate: [{ required: true, message: '请填写统计的时间' }],
  hours: [{ required: true, message: '请填写24小时内的开启时间' }],
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