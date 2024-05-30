<template>
  <el-card>
    <div class="title">
      学生答题详细情况
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input v-model="search" placeholder="请输入姓名或学号" clearable @clear="refresh" ></el-input>
        </el-col>
        <el-button type="primary" :icon="Search" @click="searchStudent()">搜索</el-button>
        <el-button type="primary" :icon="Search" @click="cancels()">取消</el-button>
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
  import { onMounted,ref,onUnmounted } from 'vue';
  import { Search, } from '@element-plus/icons-vue'
  import { examData,statisticsData,studentList } from '../util/api'
  import { examDataCancel,statisticsDataCancel } from '../util/api'
  import { clearHttpRequestingList } from '@/util/clearHttpRequest'
  const tableData = ref([]) as any;
  onMounted(()=>{
      examData({}).then(res=>{
        tableData.value = res
        tableCache.value = JSON.parse(JSON.stringify(tableData.value))
      }).catch(reason => {
        console.log('请求被取消1');
      });
      statisticsData().then().catch(e=>{
        console.log(e);
      })
      studentList().then().catch(e=>{
        console.log(e);
      })
  })
  onUnmounted(()=>{
    // 取消所有未完成的请求
    clearHttpRequestingList()
  })
  // 搜索内容
  const search = ref('')
  const tableCache = ref([])
  // 搜索方法
  const searchStudent = async ()=>{
    try {
      const res = await examData({}) 
        tableData.value = res
        tableCache.value = JSON.parse(JSON.stringify(tableData.value))
      if (!search.value.trim()) {
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
    } catch (error) {
      console.log(error,'*-*');
    }
  }
  // 取消
  const cancels= ()=>{
    studentList().then().catch(e=>{
      console.log(e);
    })
    try {
        examDataCancel('取消')
      } catch (error) {
        console.log(error);
        
      }
  }
  // 刷新
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