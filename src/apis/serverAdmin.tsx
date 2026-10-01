import { request } from '@/utils/request';
import type { AdminCredentials, ApiResponse, PostAdmin, RegistrationVerification } from '@/types/admin';

export const usernameCheckAPI = (data: { email: string }) =>
    request.post<ApiResponse<boolean>>('/post/admin/register/valid-email', data);

export const serverAdminRegisterAPI = (data: AdminCredentials) =>
    request.post<ApiResponse<null>>('/post/admin/register/init', data);

export const serverAdminRegisterValidationAPI = (data: RegistrationVerification) =>
    request.post<ApiResponse<PostAdmin>>('/post/admin/register/validate', data);

export const serverAdminLoginAPI = (data: AdminCredentials) =>
    request.post<ApiResponse<PostAdmin>>('/post/admin/login', data);

export const serverAdminLogoutAPI = () =>
    request.post<ApiResponse<null>>('/post/admin/logout');

export const getCurrentAdminAPI = () =>
    request.get<ApiResponse<PostAdmin>>('/post/admin/current');

// Binding is resolved from both account cookies by the server.
export const adminBindingAPI = () =>
    request.post<ApiResponse<PostAdmin>>('/post/admin/binding');

export const adminUnbindingAPI = () =>
    request.delete<ApiResponse<PostAdmin>>('/post/admin/binding');
