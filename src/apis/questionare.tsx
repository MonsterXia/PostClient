import { request } from '@/utils'

export function getLayerImprovmentFormAPI() {
    return request({
        url: "/public/questionare/generate/layerimprovement",
        method: "get",
    });
}

export function submitBattleGroupScoreAPI(data: any) {
    return request({
        url: "/public/questionare/submit/battlegroup",
        method: "post",
        data: data,
    });
}

export function submitLayerAcceptanceAPI(data: any) {
    return request({
        url: "/public/questionare/submit/layeracceptance",
        method: "post",
        data: data,
    });
}