<template>
  <el-card v-for="(item,i) in Eacharts" :key="i" class="cards">
    <div class="cards_c">
      {{ item.content }}
    </div>
    <v-chart class="chart" autoresize  :option="item.data" />
  </el-card>
</template>
<script setup lang='ts'>
  import VChart from "vue-echarts";
  import { onMounted,ref,computed  } from 'vue';
  import { statisticsData } from '../util/api'
  const tableData = ref([]) as any;
  onMounted(()=>{
    statisticsData().then((res:any)=>{
      tableData.value =  res 
      
    })
  })
  //计算属性
  const Eacharts = computed(() => {
    return tableData.value =  tableData.value.map((item:any)=>{
        return {
          content:item.content,
          topicID:item.topicID,
          data:{
          xAxis: {
            type: 'category',
            name: '题目答案',
            data: ['A', 'B', 'C', 'D']
          },
          yAxis: {
            type: 'value',
            name: '总人数',
            min:function () {
                return 0
            },
            max:function () {
                return item.data.length+5;
            }
          },
          tooltip: {
            trigger: "axis",
            formatter: function(params:any) {
              const value = params[0].data.value
              const total = params[0].data.total
              const percent = (value / total * 100).toFixed(2) + '%'
              return `选项：${params[0].name}<br>总人数：${total}<br>选择人数：${value}<br>占比：${percent}`
            }
          },
          series: [
            {
              data: [
                { value: item.data.filter((res:any)=>res.topicAnswer==='A').length, total: item.data.length},
                { value: item.data.filter((res:any)=>res.topicAnswer==='B').length, total: item.data.length},
                { value: item.data.filter((res:any)=>res.topicAnswer==='C').length, total: item.data.length},
                { value: item.data.filter((res:any)=>res.topicAnswer==='D').length, total: item.data.length},
              ],
              type: 'line',
              smooth: true
            }
          ]
          }
        }
      })
  })
</script>
<style lang='scss' scoped>
  .chart {
    width:800px ;
    height: 400px;
  }
  .cards{
    margin: 20px;
    .cards_c{
      font-size: 20px;
      font-weight: bold;
    }
  }
</style>