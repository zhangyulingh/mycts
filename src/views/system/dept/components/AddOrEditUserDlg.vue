<script setup lang="ts">
import {reactive, ref, onMounted} from "vue"
import {GetDepartList} from "@/api/system/dept"
import {GetAllRoleName} from "@/api/system/role"
import {encryptByAes} from "@/utils/cipher"

import {ElMessage, FormInstance} from "element-plus"

let departs: any = []
let treeData = ref([])
onMounted(async () => {
  const res = await GetDepartList(0)
  departs = res.data
  treeData.value = departs
})

const dialogVisible = ref(false)
const iniData = () => ({
  id: 0,
  trueName: "",
  phoneNumber: "",
  departmentID: 0,
  roleIDList: "",
  roleIDList1: [],
  initialPassword: "",
})
const form = reactive(iniData())
const formRef = ref<FormInstance | null>(null)
const msgText = ref("")
const roleNameList = ref([] as any[])
const tree = ref()
// let selectedKeys = ref([])
const getAllRoleNameList = async () => {
  const res: any = await GetAllRoleName()
  roleNameList.value = res.data
}
getAllRoleNameList()
const initAndShow = (type: string, row?: any) => {
  dialogVisible.value = true
  formRef.value?.resetFields()
  if (type === "edit") {
    msgText.value = "编辑员工"
    form.id = row.id
    form.trueName = row.trueName
    form.phoneNumber = row.phoneNumber
    form.departmentID = row.departID
    form.roleIDList1 = row.roleIDList ? row.roleIDList.split(",") : []
  } else {
    msgText.value = "新增员工"
    Object.assign(form, iniData(), {departmentID: null})
  }
}

// function getKeys(data: any, departName: any, keys?: []) {
//   data.forEach((item: any) => {
//     const arr = item.subDepartList?.filter((action: any) => departName === action.name)?.map((action: any) => action.id)
//     keys?.push(...((arr ?? []) as any))
//     if (item.subDepartList) getKeys(item.subDepartList, departName, keys)
//   })
// }

const emits = defineEmits(["updateList"])

const rules = {
  trueName: [{required: true, message: "请输入员工姓名", trigger: "blur"}],
  phoneNumber: [{required: true, message: "请输入联系电话", trigger: "blur"}],
  departmentID: [{required: true, message: "请输入所属部门", trigger: "blur"}],
  roleIDList1: [{required: true, message: "请输入所属角色", trigger: "blur"}],
  initialPassword: [
    {required: true, message: "请输入初始密码", trigger: "blur"},
    {
      min: 6,
      message: "初始密码长度不能少于6位",
      trigger: "blur",
    },
  ],
}

// 新增或编辑员工

const onSubmit = async () => {
  const isFormValid = await formRef.value?.validate()
  if (isFormValid) {
    form.roleIDList = form.roleIDList1.join(",")
    form.initialPassword = encryptByAes(form.initialPassword)
    const successMessage = msgText.value === "新增员工" ? "新增成功" : "编辑成功"
    emits("updateList")
    ElMessage.success(successMessage)
    dialogVisible.value = false
  }
}

// function handleCheckChange(data: {id: any}, checked: any) {
//   if (checked) {
//     tree.value.setCheckedKeys([data.id])
//   }
// }
// const defaultProps = {
//   children: "subDepartList",
//   label: "name",
// }
// 暴露变量
defineExpose({
  initAndShow,
})
const handleChange = (val: any) => {
  form.departmentID = val[val.length - 1]
}
</script>

<template>
  <el-dialog v-model="dialogVisible" width="35%">
    <template #header="{titleId, titleClass}">
      <h4 :id="titleId" :class="titleClass">{{ msgText }}</h4>
    </template>
    <el-form ref="formRef" :model="form" size="default" :rules="rules" label-width="100px">
      <el-row :gutter="35">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12" class="mb-20px">
          <el-form-item label="员工姓名" prop="trueName">
            <el-input v-model="form.trueName" placeholder="请输入员工姓名" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12" class="mb-20px">
          <el-form-item label="联系电话" prop="phoneNumber">
            <el-input v-model="form.phoneNumber" placeholder="请输入联系电话" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="所属部门" prop="departmentID">
            <el-cascader
              ref="tree"
              v-model="form.departmentID"
              :checkStrictly="true"
              :options="treeData"
              :props="{value: 'id', label: 'name', children: 'subDepartList', checkStrictly: true}"
              clearable
              show-all-levels
              placeholder="请选择所属部门"
              @change="handleChange"
              class="w-full"></el-cascader>
            <!-- <el-tree
              ref="tree"
              node-key="id"
              :data="treeData"
              :check-strictly="true"
              show-checkbox
              :props="defaultProps"
              :default-checked-keys="selectedKeys"
              @check-change="handleCheckChange"
              :default-expand-all="true"
              class="w-full">
            </el-tree> -->
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-10px">
          <el-form-item label="所属角色" prop="roleIDList1">
            <el-select v-model="form.roleIDList1" placeholder="请选择所属角色" clearable multiple class="w-full">
              <el-option
                v-for="item in roleNameList"
                :key="`${Number.parseInt(item.id)}`"
                :label="item.name"
                :value="`${Number.parseInt(item.id)}`"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-10px">
          <el-form-item label="初始密码" prop="initialPassword" v-if="msgText === '新增员工'">
            <el-input v-model="form.initialPassword" placeholder="请输入初始密码" type="password" clearable show-password />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="flex justify-center my-2">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<style scoped lang="scss">
.el-input__wrapper {
  width: 100% !important;
}
</style>
