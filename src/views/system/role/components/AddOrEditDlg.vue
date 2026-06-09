<script setup lang="ts">
import {reactive, ref} from "vue"
import {GetRoleInfo} from "@/api/system/role"
import {ElMessage, FormInstance} from "element-plus"
import {GetMenuList} from "@/api/system/menuAndAction"

const queryResult = ref()
let menus = []
onMounted(() => {
  const res = GetMenuList()
  getMenus(res.data)
  menus = res.data
  queryResult.value = res.data
})

function getMenus(data: any) {
  data.forEach((item) => {
    item.children = [...(item.subMenuList ?? []), ...(item.actionList ?? [])]
    if (item.subMenuList) getMenus(item.subMenuList)
  })
}

const defaultProps = {
  children: "children",
  label: "name",
}
const dialogVisible = ref(false)
const iniData = () => ({
  name: "",
  des: "",
  actionCodeList: "",
})
const form = reactive(iniData())
const formRef = ref<FormInstance | null>(null)
const msgText = ref("")
const tree = ref()

const initAndShow = (_, type: string) => {
  dialogVisible.value = true
  formRef.value?.resetFields()
  if (type === "edit") {
    nextTick(() => {
      msgText.value = "编辑角色"
      const res = GetRoleInfo().data
      Object.assign(form, res)
      console.log(res)
      let keys = []
      getKeys(menus, res.actionCodeList, keys)
      tree.value.setCheckedKeys(keys)
    })
  } else {
    msgText.value = "新增角色"
    Object.assign(form, iniData())
  }
}

function getKeys(data: any, actionCodeList: any, keys?: []) {
  data.forEach((item) => {
    const arr = item.actionList?.filter((action) => actionCodeList?.includes(action.code)).map((action) => action.code)
    if (arr) keys?.push(...arr)
    if (item.subMenuList) getKeys(item.subMenuList, actionCodeList, keys)
  })
}

const emits = defineEmits(["updateList"])

const rules = {
  name: [{required: true, message: "请输入角色名称", trigger: "blur"}],
  des: [{required: true, message: "请输入角色描述", trigger: "blur"}],
}

// 新增或编辑角色
const onSubmit = async () => {
  const isFormValid = await formRef.value?.validate()
  if (isFormValid) {
    const successMessage = msgText.value === "新增角色" ? "新增成功" : "编辑成功"
    form.actionCodeList = tree.value
      .getCheckedNodes()
      .filter((node) => node.parentID === undefined)
      .map((node) => node.code)
      .join(",")
    emits("updateList")
    ElMessage.success(successMessage)
    dialogVisible.value = false
  }
}
// 暴露变量
defineExpose({
  initAndShow,
})
</script>

<template>
  <el-dialog v-model="dialogVisible" width="30%">
    <template #header="{titleId, titleClass}">
      <h4 :id="titleId" :class="titleClass">{{ msgText }}</h4>
    </template>
    <el-form ref="formRef" :model="form" size="default" :rules="rules" label-width="100px">
      <el-row :gutter="35">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入角色名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="角色描述" prop="des">
            <el-input v-model="form.des" placeholder="请输入角色描述" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="角色权限">
            <el-tree ref="tree" :data="queryResult" :props="defaultProps" show-checkbox default-expand-all node-key="code" accordion></el-tree>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="flex justify-center my-8">
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
