import { request } from '@/utils'

export function getLayerImprovmentFormAPI() {
    return request({
        url: "/public/questionare/layerimprovement",
        method: "get",
    });
}

export function submitLayerImprovmentFormAPI(data: any) {
    return request({
        url: "/public/questionare/layerimprovement",
        method: "post",
        data: data,
    });
}