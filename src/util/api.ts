import http from './http'

export const examData = ({}) => { 
    return http({
        url: '/test.json',
        method: 'get',
    })
}
export const statisticsData = () => { 
    return http({
        url: '/statisticsData.json',
        method: 'get',
    })
}