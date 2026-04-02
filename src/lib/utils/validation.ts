/**
 * Client-side form validation utilities.
 * Rules mirror the backend DTO constraints for consistency.
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/* ── Email ── */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) return { valid: false, error: "Email is required" };
  if (!EMAIL_REGEX.test(email)) return { valid: false, error: "Enter a valid email address" };
  return { valid: true };
}

/* ── Password ── */
export function validatePassword(password: string): ValidationResult {
  if (!password) return { valid: false, error: "Password is required" };
  if (password.length < 8) return { valid: false, error: "Password must be at least 8 characters" };
  if (password.length > 128) return { valid: false, error: "Password must be less than 128 characters" };
  if (!/[a-z]/.test(password)) return { valid: false, error: "Include at least one lowercase letter" };
  if (!/[A-Z]/.test(password)) return { valid: false, error: "Include at least one uppercase letter" };
  if (!/\d/.test(password)) return { valid: false, error: "Include at least one number" };
  return { valid: true };
}

/* ── Confirm password ── */
export function validateConfirmPassword(password: string, confirm: string): ValidationResult {
  if (!confirm) return { valid: false, error: "Please confirm your password" };
  if (password !== confirm) return { valid: false, error: "Passwords do not match" };
  return { valid: true };
}

/* ── Name ── */
export function validateName(name: string): ValidationResult {
  if (!name.trim()) return { valid: false, error: "Name is required" };
  if (name.trim().length < 2) return { valid: false, error: "Name must be at least 2 characters" };
  if (name.trim().length > 100) return { valid: false, error: "Name must be less than 100 characters" };
  return { valid: true };
}

/* ── Generic required ── */
export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value.trim()) return { valid: false, error: `${fieldName} is required` };
  return { valid: true };
}

/* ── Run multiple validations, return first error ── */
export function validateAll(
  ...results: ValidationResult[]
): { valid: boolean; errors: Record<number, string> } {
  const errors: Record<number, string> = {};
  let valid = true;

  results.forEach((result, index) => {
    if (!result.valid && result.error) {
      errors[index] = result.error;
      valid = false;
    }
  });

  return { valid, errors };
}
