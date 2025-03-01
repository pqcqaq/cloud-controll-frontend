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
      <el-form-item label="锁机时间" prop="lockedTime">
        <el-date-picker clearable
          v-model="paramsProps.row.lockedTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择锁机时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="解锁时间" prop="unlockTime">
        <el-date-picker clearable
          v-model="paramsProps.row.unlockTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择解锁时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="锁机状态" prop="status">
        <el-select v-model="paramsProps.row.status" clearable placeholder="请选择锁机状态">
          <el-option
            v-for="item in optionsStore.getDictOptions('')"
            :key="item.id"
            :label="item.codeName"
            :value="item.id"
          />
        </el-select>
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
import { useOptionsStore } from '@/stores/modules/options'

defineOptions({
    name: 'ThreeCollectorLockForm'
})

const optionsStore = useOptionsStore()
const rules = reactive({
  delFlag: [{ required: true, message: '请填写删除与否' }],
  collectorId: [{ required: true, message: '请填写采集器ID' }],
  lockedTime: [{ required: true, message: '请填写锁机时间' }],
  unlockTime: [{ required: true, message: '请填写解锁时间' }],
  status: [{ required: true, message: '请填写锁机状态' }],
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