import { request } from '@/utils'


export function usernameCheckAPI(data: unknown) {
    return request({
        url: "/post/admin/register/valid-email",
        method: "post",
        data: data,
    });
}

export function serverAdminRegisterAPI(data: unknown) {
    return request({
        url: "/post/admin/register/init",
        method: "post",
        data: data,
    });
}

export function serverAdminRegisterValidationAPI(data: unknown) {
    return request({
        url: "/post/admin/register/validate",
        method: "post",
        data: data,
    });
}

export function serverAdminLoginAPI(data: unknown) {
    return request({
        url: "/post/admin/login",
        method: "post",
        data: data,
        withCredentials: true,
    });
}


export function serverAdminLogoutAPI() {
    return request({
        url: "/post/admin/logout",
        method: "post",
    });
}

export function getCurrentAdminAPI() {
    return request({
        url: "/post/admin/current",
        method: "get",
    });
}

export function adminBindingAPI(data: unknown) {
    return request({
        url: "/post/admin/binding",
        method: "post",
        data: data,
    });
}

export function adminUnbindingAPI() {
    return request({
        url: "/post/admin/binding",
        method: "delete",
    });
}
