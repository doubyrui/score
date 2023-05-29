<template>
  <div ref='dom'>
    <el-dialog :model-value="props.show" title="修改学生信息" :show-close="false" @open="open">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="ruleForm.sex" placeholder="请选择性别">
            <el-option label="男" value="1" />
            <el-option label="女" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age" >
          <el-input v-model="ruleForm.age"/>
        </el-form-item>
        <el-form-item label="学号" prop="stuID" >
          <el-input v-model="ruleForm.stuID"/>
        </el-form-item>
        <el-form-item>
          <el-button v-if="!addOrmod" type="primary" @click="submitForm(ruleFormRef)">修改</el-button>
          <el-button v-if="addOrmod" type="primary" @click="submitForm(ruleFormRef)">添加</el-button>
          <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        </el-form-item>
      </el-form>

  </el-dialog>
  </div>
</template>
<script setup lang='ts'>
  import { reactive,onMounted,ref } from 'vue';
  import type { FormInstance, FormRules  } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { useStore  } from 'vuex';
  import { useMapState } from '../Hooks/useMapState'
  const { studentData } = useMapState(['studentData'])
  const store = useStore() //vuex
  const ruleFormRef = ref<FormInstance>()
  //验证年龄
  const checkAge = (rule: any, value: any, callback: any) => {
    if (!value) {
      return callback(new Error('请输入年龄'))
    }else {
      if (/^\d+$/.test(value) == false) {
        callback(new Error("请输入数字"));
      } 
      callback()
    }
  }
  //验证学号
  const checkstuID = (rule: any, value: any, callback: any) => {
    if (!value) {
      return callback(new Error('请输入学号'))
    }else {
      if (/^\d+$/.test(value) == false) {
        callback(new Error("请输入数字"));
      } 
      callback()
    }
  }
  //验证姓名
  const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请输入姓名'))
    } else {
      if (/^[\u4e00-\u9fa5]+$/.test(value) == false) {
        callback(new Error("请输入中文"));
      } 
      callback()
    }
  }
  //验证性别
  const validatePass2 = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请选择性别'))
    } else {
      callback()
    }
  }
  //验证规则
  const rules = reactive<FormRules>({
    name: [{ validator: validatePass, trigger: 'blur' }],
    sex: [{ validator: validatePass2, trigger: 'blur' }],
    age: [{ validator: checkAge, trigger: 'blur' }],
    stuID: [{ validator: checkstuID, trigger: 'blur' }],
  })
  let ruleForm = ref({
    name: '',
    sex: '',
    age: '',
    stuID: ''
  }) as any
  const open = () => {
    ruleForm.value = JSON.parse(JSON.stringify(props.stuData))
    ruleForm.value.sex=ruleForm.value.sex=='1'?'男':'女'
  }
  //提交
  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        if (props.addOrmod) {
          let index = studentData.value.studentList.findIndex((res:any)=>res.stuID == ruleForm.value.stuID)
          if (index===-1) {
            store.commit('addStudent',ruleForm.value)
            emit('close',false)
            ElMessage({
              message: '添加成功',
              type: 'success',
            })
          }else{
            ElMessage({
              message: '学号重复',
              type: 'warning',
            })
          }
        }else{
          ElMessage({
              message: '修改成功',
              type: 'success',
            })
          store.commit('modification',ruleForm.value)
          emit('close',false)
        }
      } else {
        return false
      }
    })
    
  }
  const emit = defineEmits(['close'])
  //取消
  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    emit('close',false)
  }
  onMounted(()=>{

  })
  //props
  const props = defineProps({
    show:{
      type:Boolean,
      default:false
    },
    stuData:{
      type:Object,
      default:()=>{}
    },
    addOrmod:{
      type:Boolean,
      default:false
    }
  })
</script>
<style lang='scss' scoped>
  
</style>