import { request } from '@/utils'

// export function serverAdminRegisterAPI() {
//     return request({
//         url: "/public/questionare/layerimprovement",
//         method: "post",
//     });
// }

export function usernameCheckAPI(data: unknown) {
    return request({
        url: "/public/register/valid-email",
        method: "post",
        data: data,
    });
}

export function serverAdminRegisterAPI(data: unknown) {
    return request({
        url: "/public/register/init",
        method: "post",
        data: data,
    });
}

export function serverAdminRegisterValidationAPI(data: unknown) {
    return request({
        url: "/public/register/validate",
        method: "post",
        data: data,
    });
}

export function serverAdminLoginAPI(data: unknown) {
    return request({
        url: "/admin/login",
        method: "post",
        data: data,
        withCredentials: true,
    });
}
