// Keep registration rules aligned with CommonServerAPI's bcrypt password policy.
export function passwordValidationError(value: string): string | null {
    if (value.length < 6) return 'passwordNotLessThan6';
    if (value.length > 128 || new TextEncoder().encode(value).length > 72) return 'passwordTooLong';
    if (!/[A-Z]/.test(value)) return 'passwordMustContainUppercase';
    if (!/[a-z]/.test(value)) return 'passwordMustContainLowercase';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'passwordMustContainSpecialChar';
    return null;
}
