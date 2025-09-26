import bcrypt from 'bcrypt';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const validatePasswordStrength = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Password must be at least ${minLength} characters long`
    };
  }

  // Optional: Add more strength requirements
  const strengthChecks = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar];
  const strengthScore = strengthChecks.filter(Boolean).length;

  if (strengthScore < 2) {
    return {
      isValid: false,
      message: 'Password too weak. Include uppercase, lowercase, numbers, or special characters'
    };
  }

  return { isValid: true, message: 'Password strength OK' };
};
