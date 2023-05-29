export default{
    state: {
        studentList:[] as any,
    },
    getters: {
    },
    mutations: {
        setStudentList(state:any,studentList:any){ //初始化
            state.studentList = studentList
        },
        modification(state:any,student:any){ //修改
            let index = state.studentList.findIndex((res:any)=>res.stuID == student.stuID)
            state.studentList.splice(index,1,student)
        },
        addStudent(state:any,student:any){ //增加
            state.studentList.push(student)
        },
        deleteStudent(state:any,student:any){ //删除
            let index = state.studentList.findIndex((res:any)=>res.stuID == student.stuID)
            state.studentList.splice(index,1)
        },
        multiDeleteStudent(state:any,student:any){ //批量删除
            state.studentList = state.studentList.filter((item:any) => {
                return !student.some((s:any) => s.stuID === item.stuID)
            })
        },
    },
    actions: {
    },
    modules: {
      
    }
}