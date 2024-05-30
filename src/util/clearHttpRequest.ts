export let httpRequestList = <any>[];

export const clearHttpRequestingList = () => {
    if (httpRequestList.length > 0) {
        httpRequestList.forEach((item:any) => {
            item('interrupt')
        })
        httpRequestList = []
    }
}
