<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input v-model="search" placeholder="请输入姓名或学号" clearable @clear="refresh"></el-input>
      </el-col>
      <el-button type="primary" :icon="Search"  @click="searchStudent(1)">搜索</el-button>
      <el-button type="primary" :icon="Plus" @click="add">添加</el-button>
      <el-button type="primary" :icon="Delete" @click="multiDel()">批量删除</el-button>
    </el-row>
    <el-table class="box_table" :data="getTableData" style="width: 100%; height: 100%;" row-key="stuID"
      @selection-change="handleSelectionChange"
      ref="multipleTableRef"
      >
      <el-table-column fixed type="selection" reserve-selection width="45">
      </el-table-column>
      <el-table-column prop="name" label="姓名" min-width="120" />
      <el-table-column prop="sex" min-width="120">
        <template #default="props">
          {{props.row.sex==1?'男':'女'}}
        </template>
      </el-table-column>
      <el-table-column prop="age" label="年龄" min-width="120" />
      <el-table-column prop="stuID" label="学号" min-width="120" />
      <el-table-column fixed="right" label="操作" min-width="120" >
        <template #default="scope">
          <el-button link type="primary" size="small" @click="setting(scope.$index, scope.row)">
            修改
          </el-button>
          <el-button link type="primary" size="small" @click="deleteData(scope.$index, scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination background layout="prev, pager, next" :current-page="page" :page-size="15" :total="total" @current-change="changePage"/>
    </div>
  </el-card>
  <alter-dialog :show="show" :stuData="stuData" :addOrmod="addOrmod" @close="close" ref="Dialog"></alter-dialog>
</template>
<script setup lang='ts'>
  import alterDialog from '../components/alterDialog.vue'
  import { ElMessage,ElMessageBox  } from 'element-plus'
  import { useMapState } from '../Hooks/useMapState'
  import { Delete, Search, Plus } from '@element-plus/icons-vue'
  import { onMounted,ref } from 'vue';
  import { useStore  } from 'vuex';
  const { studentData } = useMapState(['studentData'])
  const store = useStore() //vuex
  onMounted(()=>{
    setData()
  })
  const search = ref('') //搜索内容
  const page = ref(1) //当前页
  const pageSize = ref(15) //一页几条
  const total = ref(0) //总条数
  const searchResult = ref([]) //搜索结果
  const tableData = ref(
    [
      {name:'赵子璇',stuID:'202320311101',sex:'1',age:'15'},
      {name:'钱淼',stuID:'202320311102',sex:'1',age:'15'},
      {name:'孙国栋',stuID:'202320311103',sex:'1',age:'15'},
      {name:'李瑞堂',stuID:'202320311104',sex:'1',age:'15'},
      {name:'周甜',stuID:'202320311105',sex:'0',age:'15'},
      {name:'吴敏',stuID:'202320311106',sex:'0',age:'15'},
      {name:'郑国贤',stuID:'202320311107',sex:'1',age:'15'},
      {name:'王贺祥',stuID:'202320311108',sex:'1',age:'15'},
      {name:'冯晨涛',stuID:'202320311109',sex:'1',age:'15'},
      {name:'陈昊轩',stuID:'202320311110',sex:'1',age:'15'},
      {name:'褚易轩',stuID:'202320311111',sex:'1',age:'15'},
      {name:'卫益辰',stuID:'202320311112',sex:'1',age:'15'},
      {name:'蒋益帆',stuID:'202320311113',sex:'1',age:'15'},
      {name:'沈益冉',stuID:'202320311114',sex:'0',age:'15'},
      {name:'韩瑾春',stuID:'202320311115',sex:'0',age:'15'},
      {name:'杨瑾昆',stuID:'202320311116',sex:'1',age:'15'},
      {name:'朱春齐',stuID:'202320311117',sex:'0',age:'15'},
      {name:'秦杨',stuID:'202320311118',sex:'1',age:'15'},
      {name:'尤文昊',stuID:'202320311119',sex:'1',age:'15'},
      {name:'许东东',stuID:'202320311120',sex:'1',age:'15'},
      {name:'何雄霖',stuID:'202320311121',sex:'1',age:'15'},
      {name:'吕浩晨',stuID:'202320311122',sex:'1',age:'15'},
      {name:'施熙涵',stuID:'202320311123',sex:'0',age:'15'},
      {name:'张溶溶',stuID:'202320311124',sex:'0',age:'15'},
      {name:'孔冰枫',stuID:'202320311125',sex:'0',age:'15'},
      {name:'曹欣欣',stuID:'202320311126',sex:'0',age:'15'},
      {name:'严宜豪',stuID:'202320311127',sex:'1',age:'15'},
      {name:'华欣慧',stuID:'202320311128',sex:'0',age:'15'},
      {name:'金建政',stuID:'202320311129',sex:'1',age:'15'},
      {name:'魏美欣',stuID:'202320311130',sex:'0',age:'15'},
      {name:'魏诗悦',stuID:'202320311131',sex:'0',age:'15'},
    ] as any,
  )
  const getTableData = ref([] as any,) //表格数据
  const selectionList = ref([] as any,) //选中的数据
  const multipleTableRef = ref()

  const handleSelectionChange = (val:any) => { //选中的数据
    selectionList.value = val
  }
  let show = ref(false) //修改信息弹窗
  let addOrmod = ref(false) //添加还是修改
  const stuData = ref({}) //修改信息弹窗
  let Dialog:any = ref(null) //弹窗dom
  const setting = (index: number, row: object) => { //修改
    stuData.value = row
    addOrmod.value = false
    show.value=true
  }
  const add = () => { //添加
    addOrmod.value = true
    show.value=true
  }
  interface User {
    date: string
    name: string
    address: string
  }
  const multiDel = (rows?: User[]) => { //批量删除
    ElMessageBox.confirm('确定删除吗?','提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      if (searchType.value) {
        if (selectionList.value.length==0) {
          ElMessage.error('请选择要删除的数据')
          return
        }
        searchResult.value = searchResult.value.filter((item:any) => {
            return !selectionList.value.some((s:any) => s.stuID === item.stuID)
        })
        store.commit('multiDeleteStudent',selectionList.value)
        multipleTableRef.value!.clearSelection()
        changePage(page.value)
      }else{
        if (selectionList.value.length==0) {
          ElMessage.error('请选择要删除的数据')
          return
        }
        store.commit('multiDeleteStudent',selectionList.value)
        multipleTableRef.value!.clearSelection()
        getStudentList(page.value)
      }
      ElMessage({type: 'success',message: '已删除',})}).catch(() => {
        ElMessage({
          type: 'info',
          message: '取消',
        })
      })
  }
  const deleteData = (index: number, row: any) => { //删除
    ElMessageBox.confirm('确定删除吗?','提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      if (searchType.value) {
        let index = searchResult.value.findIndex((res:any)=>res.stuID == row?.stuID)
        searchResult.value.splice(index,1)
        store.commit('deleteStudent',row)
        changePage(page.value)
      }else{
        store.commit('deleteStudent',row)
        getStudentList(page.value)
      }
      ElMessage({type: 'success',message: '已删除',})}).catch(() => {
        ElMessage({
          type: 'info',
          message: '取消',
        })
      })
  }
  const searchType = ref(false) //搜索类型
  const searchStudent = (e:any) => { //搜索
    if (search.value.trim()) {
      searchType.value = true
      page.value = e
      getTableData.value = studentData.value.studentList.filter((res:any) => {
        return res.name.indexOf(search.value) != -1
      })
      if (getTableData.value.length==0) {
        getTableData.value = studentData.value.studentList.filter((res:any) => {
          return res.stuID.indexOf(search.value) != -1
        })
      }
      searchResult.value = JSON.parse(JSON.stringify(getTableData.value))
      changePage(page.value)
    }else{
      searchType.value = false
      getStudentList(page.value)
    }
  }
  const refresh = () =>{
    searchStudent(1)
  }
  const setData = () => { //将数据存入vuex用来模拟后台数据
    if (studentData.value.studentList.length) {
      getStudentList(page.value)
    }else{
      
      store.commit('setStudentList',tableData.value)
      getStudentList(page.value)
    }
  }
  const getStudentList = (pageNum:any) => { //模拟获取数据
    getTableData.value = studentData.value.studentList.slice(pageSize.value*(pageNum-1),pageSize.value*pageNum)
    total.value = studentData.value.studentList.length
  }
  const changePage = (pageNum:any) =>{ //模拟分页请求
    if (searchType.value) {
      page.value = pageNum
      total.value = searchResult.value.length
      getTableData.value = searchResult.value.slice(pageSize.value*(pageNum-1),pageSize.value*pageNum)
    }else{
      page.value = pageNum
      getTableData.value = studentData.value.studentList.slice(pageSize.value*(pageNum-1),pageSize.value*pageNum)
    }
  }
  const close = (e:any) => { //关闭弹窗
    stuData.value = {}
    show.value=!show.value
    searchStudent(page.value)
  }
  
</script>
<style lang='scss' scoped>
  
</style>