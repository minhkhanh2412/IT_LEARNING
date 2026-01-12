
export interface ValidationRule {
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  message: string;
  custom?: (value: string, formData?: any) => boolean;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export const VALIDATION_PATTERNS = {
  // Tài khoản: 4-20 ký tự, chỉ chữ, số và gạch dưới
  username: /^[a-zA-Z0-9_]{4,20}$/,
  
  // Mật khẩu: Tối thiểu 6 ký tự
  password: /^.{6,}$/,
  
  // Email: Format chuẩn
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Số điện thoại: 10 số
  phone: /^[0-9]{10}$/,
  
  // Họ tên: 2-50 ký tự, chỉ chữ cái (có dấu) và khoảng trắng
  fullName: /^[a-zA-ZÀ-ỹ\s]{2,50}$/,
};

export const VALIDATION_MESSAGES = {
  required: 'Trường này là bắt buộc',
  username: 'Tài khoản phải từ 4-20 ký tự, chỉ chứa chữ, số và gạch dưới (_)',
  password: 'Mật khẩu phải có ít nhất 6 ký tự',
  passwordConfirm: 'Mật khẩu xác nhận không khớp',
  email: 'Email không hợp lệ',
  phone: 'Số điện thoại phải có đúng 10 số',
  fullName: 'Họ tên phải chỉ chứa chữ cái và khoảng trắng',
};

export const COMMON_VALIDATION_RULES: ValidationRules = {
  taiKhoan: {
    pattern: VALIDATION_PATTERNS.username,
    minLength: 4,
    maxLength: 20,
    message: VALIDATION_MESSAGES.username,
  },
  matKhau: {
    pattern: VALIDATION_PATTERNS.password,
    minLength: 6,
    message: VALIDATION_MESSAGES.password,
  },
  xacNhanMatKhau: {
    message: VALIDATION_MESSAGES.passwordConfirm,
    custom: (value: string, formData?: any) => {
      return value === formData?.matKhau;
    },
  },
  email: {
    pattern: VALIDATION_PATTERNS.email,
    message: VALIDATION_MESSAGES.email,
  },
  soDT: {
    pattern: VALIDATION_PATTERNS.phone,
    message: VALIDATION_MESSAGES.phone,
  },
  hoTen: {
    pattern: VALIDATION_PATTERNS.fullName,
    minLength: 2,
    maxLength: 50,
    message: VALIDATION_MESSAGES.fullName,
  },
};


export const validateField = (
  fieldName: string,
  value: string,
  formData?: any,
  rules?: ValidationRules
): string => {
  const validationRules = rules || COMMON_VALIDATION_RULES;
  const rule = validationRules[fieldName];

  if (!rule) return '';

  // Check required
  if (!value || value.trim() === '') {
    return VALIDATION_MESSAGES.required;
  }

  // Check min length
  if (rule.minLength && value.length < rule.minLength) {
    return rule.message;
  }

  // Check max length
  if (rule.maxLength && value.length > rule.maxLength) {
    return rule.message;
  }

  // Check pattern
  if (rule.pattern && !rule.pattern.test(value)) {
    return rule.message;
  }

  // Check custom validation
  if (rule.custom && !rule.custom(value, formData)) {
    return rule.message;
  }

  return '';
};

// Validate all fields
export const validateAllFields = (
  formData: { [key: string]: string },
  fieldsToValidate: string[],
  rules?: ValidationRules
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  fieldsToValidate.forEach((fieldName) => {
    const error = validateField(fieldName, formData[fieldName], formData, rules);
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
};


export const hasErrors = (errors: { [key: string]: string }): boolean => {
  return Object.values(errors).some((error) => error !== '');
};


export const getPasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let strength = 0;
  
  // Length
  if (password.length >= 6) strength++;
  if (password.length >= 10) strength++;
  
  // Has uppercase
  if (/[A-Z]/.test(password)) strength++;
  
  // Has lowercase
  if (/[a-z]/.test(password)) strength++;
  
  // Has number
  if (/\d/.test(password)) strength++;
  
  // Has special char
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
  
  // Return 0-4 scale
  return Math.min(4, Math.floor(strength / 1.5));
};


export const getPasswordStrengthLabel = (strength: number): string => {
  const labels = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
  return labels[strength] || '';
};


export const getPasswordStrengthColor = (strength: number): string => {
  const colors = ['#ff4d4f', '#ff7a45', '#ffa940', '#52c41a', '#389e0d'];
  return colors[strength] || '#d9d9d9';
};
