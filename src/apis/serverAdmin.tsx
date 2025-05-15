import { request } from '@/utils'

// export function serverAdminRegisterAPI() {
//     return request({
//         url: "/public/questionare/layerimprovement",
//         method: "post",
//     });
// }

export function usernameCheckAPI(data: any) {
    return request({
        url: "/public/register/valid-email",
        method: "post",
        data: data,
    });
}

export function serverAdminRegisterAPI(data: any) {
    return request({
        url: "/public/register/init",
        method: "post",
        data: data,
    });
}

export function serverAdminRegisterValidationAPI(data: any) {
    return request({
        url: "/public/register/validate",
        method: "post",
        data: data,
    });
}

export function serverAdminLoginAPI(data: any) {
    return request({
        url: "/admin/login",
        method: "post",
        data: data,
        withCredentials: true,
    });
}