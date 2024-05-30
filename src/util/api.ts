import {http,CancelToken} from './http'

export let examDataCancel :any
export const examData = ({}) => { 
    return http({
        url: '/test.json',
        method: 'get',
        cancelToken: new CancelToken(cancelFn => {
            examDataCancel = cancelFn
        }),
    })
}

export let statisticsDataCancel :any
export const statisticsData = () => { 
    return http({
        url: '/statisticsData.json',
        method: 'get',
        cancelToken: new CancelToken(cancelFn => {
            statisticsDataCancel = cancelFn
        }),
    })
}

let studentListCancel :any
export const studentList = () => {
    return http({
        url: '/department/record/available-members/' ,
        method: 'post',
        cancelToken: new CancelToken(cancelFn => {
            studentListCancel && studentListCancel()
            studentListCancel = cancelFn
        }),
    })
}
