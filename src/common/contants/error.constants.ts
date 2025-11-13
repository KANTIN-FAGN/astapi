export const ERROR = {
    IncorrectCredentials: {
        code: 'incorrect-credentials',
        message: 'Email or password invalid',
    },
    UnauthorizedAccess: {
        code: 'unauthorized-access',
        message: 'Access unauthorized',
    },
    MissingFields: {
        code: 'missing-fields',
        message: 'Required fields are missing',
    },
    InvalidToken: {
        code: 'invalid-token',
        message: 'Invalid or expired token',
    },
    ResourceNotFound: {
        code: 'resource-not-found',
        message: 'Resource not found',
    },
    InvalidInputFormat: {
        code: 'invalid-input-format',
        message: 'Invalid input format',
    },
    ForbiddenAction: {
        code: 'forbidden-action',
        message: 'You don’t have permission to perform this action',
    },
    TooManyRequests: 'too-many-requests',
    PasswordStrengthError: {
        code: 'password-strength-error',
        message: 'Your password does not meet the requirements',
    },
    EmailNotVerified: {
        code: 'email-not-verified',
        message: 'Please verify your email address',
    },
    AlreadyExists: {
        code: 'alreadyExists',
        message: 'Already exists',
    },
    ConflictError: {
        code: 'conflict-error',
        message: 'Data conflict detected, please resolve conflicts',
    },
    EmailSucces: {
        code: 'email-succes',
        message: 'Email successfully send',
    },
    EmailError: {
        code: 'email-not-send',
        message: 'Email has not been sent',
    },
};