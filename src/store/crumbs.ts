export default{
    state: {
        crumbsList:[] as any,
        routerPath:{} as any,
    },
    getters: {
    },
    mutations: {
        addTab(state:any,student:any){ //增加
            let wand = state.crumbsList.findIndex((res:any)=>res.path == student.path)
            if(wand === -1){
                state.crumbsList.push(student)
            }
        },
        deleteTab(state:any,student:any){ //修改
            state.crumbsList = student
        },
        routerP(state:any,student:any){ //当前路由
            state.routerPath = student
        }    
    },
    actions: {
    },
    modules: {
      
    }
}