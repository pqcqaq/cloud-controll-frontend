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
      <el-form-item label="类别ID" prop="categoryId">
        <el-input-number
          v-model="paramsProps.row.categoryId" :precision="0" :min="1" :max="999999" />
      </el-form-item>
      <el-form-item label="生成的SN" prop="code">
        <el-input
          v-model="paramsProps.row.code"
          placeholder="请填写生成的SN"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="自增号" prop="seq">
        <el-input-number
          v-model="paramsProps.row.seq" :precision="0" :min="1" :max="999999" />
      </el-form-item>
      <el-form-item label="是否已经使用" prop="used">
        <el-input-number
          v-model="paramsProps.row.used" :precision="0" :min="1" :max="999999" />
      </el-form-item>
      <el-form-item label="生产日期" prop="produceTime">
        <el-date-picker clearable
          v-model="paramsProps.row.produceTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择生产日期">
        </el-date-picker>
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
    name: 'OneGenSnForm'
})

const rules = reactive({
  delFlag: [{ required: true, message: '请填写删除与否' }],
  categoryId: [{ required: true, message: '请填写类别ID' }],
  code: [{ required: true, message: '请填写生成的SN' }],
  seq: [{ required: true, message: '请填写自增号' }],
  used: [{ required: true, message: '请填写是否已经使用' }],
  produceTime: [{ required: true, message: '请填写生产日期' }],
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