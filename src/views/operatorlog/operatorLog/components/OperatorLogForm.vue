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
      <el-form-item label="日志等级" prop="level">
        <el-select v-model="paramsProps.row.level" clearable placeholder="请选择日志等级">
          <el-option
            v-for="item in optionsStore.getDictOptions('')"
            :key="item.id"
            :label="item.codeName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="消息" prop="msg">
        <el-input
          v-model="paramsProps.row.msg"
          placeholder="请填写消息"
          :rows="2"
          type="textarea"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="是否成功" prop="success">
        <el-select v-model="paramsProps.row.success" clearable placeholder="请选择是否成功">
          <el-option
            v-for="item in optionsStore.getDictOptions('')"
            :key="item.id"
            :label="item.codeName"
            :value="Number(item.id)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="失败原因" prop="cause">
        <el-input
          v-model="paramsProps.row.cause"
          placeholder="请填写失败原因"
          :rows="2"
          type="textarea"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="元数据" prop="metadata">
        <el-input
          v-model="paramsProps.row.metadata"
          placeholder="请填写元数据"
          clearable
        ></el-input>
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
    name: 'OperatorLogForm'
})

const optionsStore = useOptionsStore()
const rules = reactive({
  delFlag: [{ required: true, message: '请填写删除与否' }],
  level: [{ required: true, message: '请填写日志等级' }],
  msg: [{ required: true, message: '请填写消息' }],
  success: [{ required: true, message: '请填写是否成功' }],
  cause: [{ required: true, message: '请填写失败原因' }],
  metadata: [{ required: true, message: '请填写元数据' }],
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