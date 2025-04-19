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
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="paramsProps.row.name"
          placeholder="请填写名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="行政级别" prop="level">
        <el-input
          v-model="paramsProps.row.level"
          placeholder="请填写行政级别"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="层级深度" prop="depth">
        <el-input-number
          v-model="paramsProps.row.depth" :precision="0" :min="1" :max="999999" />
      </el-form-item>
      <el-form-item label="父ID" prop="parentId">
        <el-input
          v-model="paramsProps.row.parentId"
          placeholder="请填写父ID"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="代码" prop="code">
        <el-input
          v-model="paramsProps.row.code"
          placeholder="请填写代码"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="中心点" prop="center">
        <el-input
          v-model="paramsProps.row.center"
          placeholder="请填写中心点"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="序号" prop="$$seq$$">
        <el-input-number
          v-model="paramsProps.row.$$seq$$" :precision="0" :min="1" :max="999999" />
      </el-form-item>
      <el-form-item label="创建时间" prop="$$createAt$$">
        <el-input-number
          v-model="paramsProps.row.$$createAt$$" :precision="0" :min="1" :max="999999" />
      </el-form-item>
      <el-form-item label="更新时间" prop="$$updateAt$$">
        <el-input-number
          v-model="paramsProps.row.$$updateAt$$" :precision="0" :min="1" :max="999999" />
      </el-form-item>
      <el-form-item label="删除时间" prop="$$deleteAt$$">
        <el-input-number
          v-model="paramsProps.row.$$deleteAt$$" :precision="0" :min="1" :max="999999" />
      </el-form-item>
      <el-form-item label="" prop="$$triggerData$$">
        <el-input
          v-model="paramsProps.row.$$triggerData$$"
          placeholder="请填写"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="" prop="$$triggerUuid$$">
        <el-input
          v-model="paramsProps.row.$$triggerUuid$$"
          placeholder="请填写"
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

defineOptions({
    name: 'AreaForm'
})

const rules = reactive({
  name: [{ required: true, message: '请填写名称' }],
  level: [{ required: true, message: '请填写行政级别' }],
  depth: [{ required: true, message: '请填写层级深度' }],
  code: [{ required: true, message: '请填写代码' }],
  center: [{ required: true, message: '请填写中心点' }],
  $$seq$$: [{ required: true, message: '请填写序号' }],
  $$createAt$$: [{ required: true, message: '请填写创建时间' }],
  $$updateAt$$: [{ required: true, message: '请填写更新时间' }],
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