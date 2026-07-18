import { request } from '@/utils'

export function getLayerImprovmentFormAPI() {
    return request({
        url: "/public/questionare/layerimprovement",
        method: "get",
    });
}

export function submitLayerImprovmentFormAPI(data: unknown) {
    return request({
        url: "/public/questionare/layerimprovement",
        method: "post",
        data: data,
    });
}
