<template>
  <el-card>
    <div class="title">
      学生答题详细情况
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input v-model="search" placeholder="请输入姓名或学号" clearable @clear="refresh" ></el-input>
        </el-col>
        <el-button type="primary" :icon="Search" @click="searchStudent()">搜索</el-button>
      </el-row>
    </div>
    <el-table :data="tableData"  style="width: 100%" :border="true">
      <el-table-column type="expand">
        <template #default="props">
          <div m="4">
            <h3 style="text-align: center;">答题详情--{{props.row.name}}</h3>
            <el-table :data="props.row.topicRecord" :border="true">
              <el-table-column label="题号">
                <template #default="props">
                  <div class="size">
                    {{props.row.topicID}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="学生答案">
                <template #default="props">
                  <div :class="props.row.topicCorrect==props.row.topicAnswer?'blue':'red'">
                    {{props.row.topicAnswer}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="正确答案">
                <template #default="props">
                  <div class="blue">
                    {{props.row.topicCorrect}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="题目得分">
                <template #default="props">
                  <div class="size">
                    {{props.row.topicScore}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="是否正确">
                <template #default="props">
                  <div :class="props.row.correct==='1'?'blue':'red'">
                    {{props.row.correct==='1'?'正确':'错误'}}
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" />
      <el-table-column label="学号" prop="stuID">
      </el-table-column>
      <el-table-column label="性别" >
        <template #default="props">
          {{props.row.sex==='1'?'男':'女'}}
        </template>
      </el-table-column> 
      <el-table-column label="总分" prop="grossScore"/>
    </el-table>
  </el-card>
</template>
<script setup lang="ts">
  import { onMounted,ref } from 'vue';
  import { Search, } from '@element-plus/icons-vue'
  import { examData } from '../util/api'
  const tableData = ref([]) as any;
  onMounted(()=>{
    examData().then(res=>{
      tableData.value = res
      tableCache.value = JSON.parse(JSON.stringify(tableData.value))
    })
  })
  //搜索内容
  const search = ref('')
  const tableCache = ref([])
  //搜索方法
  const searchStudent = ()=>{
    if (!search.value.trim()) {
      console.log('空');
      tableData.value = tableCache.value
      search.value = ''
    }else{
      tableData.value = tableCache.value.filter((res:any) => {
        return res.name.indexOf(search.value) != -1
      })
      if (tableData.value.length==0) {
        tableData.value = tableCache.value.filter((res:any) => {
          return res.stuID.indexOf(search.value) != -1
        })
      }
    }
  }
  //刷新
  const refresh = ()=>{
    tableData.value = tableCache.value
  }
</script>
<style lang='scss' scoped>
  .title{
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 20px;
  }
  .blue{
    color: blue;
    font-size: 14px;
    font-weight: 600;
  }
  .red{
    color: red;
    font-size: 14px;
    font-weight: 600;
  }
  .size{
    font-size: 14px;
    font-weight: 600;
  }
</style>