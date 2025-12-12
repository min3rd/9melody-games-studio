// Error codes use the format VVxEEEE where VV is API version (2-digit),
// 'x' is a literal separator, and EEEE is a 4-digit error id, e.g. 00x0001
export const ErrorCodes = {
  EMAIL_REQUIRED: '00x0001',
  PASSWORD_REQUIRED: '00x0002',
  IDENTIFIER_REQUIRED: '00x0003',
  USER_NOT_FOUND: '00x0004',
  INVALID_CREDENTIALS: '00x0005',
  PASSWORD_SIGNIN_NOT_AVAILABLE: '00x0006',
  NOT_AUTHORIZED: '00x0007',
  EMAIL_EXISTS: '00x0008',
  USERNAME_EXISTS: '00x0009',
  INVALID_ID: '00x0010',
  INTERNAL_ERROR: '00x0011',
  ASSET_NAME_REQUIRED: '00x0012',
  ASSET_NOT_FOUND: '00x0013',
  ASSET_PARENT_INVALID: '00x0014',
  ASSET_UPLOAD_REQUIRED: '00x0015',
  ASSET_NAME_CONFLICT: '00x0016',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

// Create reverse map so we can optionally map back to descriptive key if needed
export const ErrorNamesByCode: Record<string, string> = Object.fromEntries(
  (Object.keys(ErrorCodes) as (keyof typeof ErrorCodes)[]).map((k) => [ErrorCodes[k], k])
);

export function formatError(code: ErrorCode, message?: string) {
  return { code, message } as const;
}

export function codeFor(name: keyof typeof ErrorCodes) {
  return ErrorCodes[name];
}
