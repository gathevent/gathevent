import { z } from "@hono/zod-openapi";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { ZodError } from "zod";
import { parseZodError } from "@/pkg/utils/zod-error";

const ERROR_CONFIG = {
  BAD_REQUEST: {
    status: 400,
    message: "The request was invalid or cannot be served.",
  },
  UNAUTHORIZED: {
    status: 401,
    message: "Authentication is required and has failed or has not yet been provided.",
  },
  FORBIDDEN: {
    status: 403,
    message: "The request was a valid request, but the server is refusing to respond to it.",
  },
  NOT_FOUND: {
    status: 404,
    message: "The requested resource could not be found.",
  },
  METHOD_NOT_ALLOWED: {
    status: 405,
    message: "The request method is not supported for the requested resource.",
  },
  CONFLICT: {
    status: 409,
    message:
      "The request could not be completed due to a conflict with the current state of the resource.",
  },
  TOO_MANY_REQUESTS: {
    status: 429,
    message: "You have sent too many requests in a given amount of time. Please try again later.",
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: "An unexpected error occurred on the server.",
  },
} as const;

const STATUS_TO_CODE_MAP = new Map<ContentfulStatusCode, keyof typeof ERROR_CONFIG>(
  Object.entries(ERROR_CONFIG).map(([code, config]) => [
    config.status,
    code as keyof typeof ERROR_CONFIG,
  ]),
);

const ErrorCodes = z.enum([
  "BAD_REQUEST",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "INTERNAL_SERVER_ERROR",
  "NOT_FOUND",
  "CONFLICT",
  "METHOD_NOT_ALLOWED",
  "TOO_MANY_REQUESTS",
]);

const ErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: ErrorCodes.openapi({
      description: "A machine-readable error code",
      example: "BAD_REQUEST",
    }),
    name: z.string().openapi({
      description:
        "A short, machine-readable identifier for the error, used as a key for i18n translations",
      example: "EmailAlreadyInUse",
    }),
    message: z.string().openapi({ description: "A human-readable explanation of the error" }),
    details: z.record(z.any(), z.unknown()).optional().openapi({
      description: "Additional details about the error",
    }),
  }),
});

const codeToStatus = (code: keyof typeof ERROR_CONFIG): ContentfulStatusCode => {
  return ERROR_CONFIG[code]?.status ?? ERROR_CONFIG.INTERNAL_SERVER_ERROR.status;
};

const statusToCode = (status: ContentfulStatusCode): keyof typeof ERROR_CONFIG => {
  return STATUS_TO_CODE_MAP.get(status) ?? "INTERNAL_SERVER_ERROR";
};

const codeToDefaultMessage = (code: keyof typeof ERROR_CONFIG): string => {
  return ERROR_CONFIG[code]?.message ?? ERROR_CONFIG.INTERNAL_SERVER_ERROR.message;
};

class GathEventApiError extends HTTPException {
  public readonly code: keyof typeof ERROR_CONFIG;
  public readonly details?: Record<string, unknown>;

  constructor({
    code,
    name,
    message,
    details,
  }: {
    code: keyof typeof ERROR_CONFIG;
    name: string;
    message?: string;
    details?: Record<string, unknown>;
  }) {
    const errorMessage = message ?? codeToDefaultMessage(code);
    super(codeToStatus(code), { message: errorMessage });
    this.code = code;
    this.name = name;
    this.details = details;
  }

  static badRequest(name: string, message?: string, details?: Record<string, unknown>) {
    return new GathEventApiError({
      code: "BAD_REQUEST",
      name,
      message,
      details,
    });
  }

  static unauthorized(name: string, message?: string, details?: Record<string, unknown>) {
    return new GathEventApiError({
      code: "UNAUTHORIZED",
      name,
      message,
      details,
    });
  }

  static forbidden(name: string, message?: string, details?: Record<string, unknown>) {
    return new GathEventApiError({ code: "FORBIDDEN", name, message, details });
  }

  static notFound(name: string, message?: string, details?: Record<string, unknown>) {
    return new GathEventApiError({ code: "NOT_FOUND", name, message, details });
  }

  static conflict(name: string, message?: string, details?: Record<string, unknown>) {
    return new GathEventApiError({ code: "CONFLICT", name, message, details });
  }

  static methodNotAllowed(name: string, message?: string, details?: Record<string, unknown>) {
    return new GathEventApiError({
      code: "METHOD_NOT_ALLOWED",
      name,
      message,
      details,
    });
  }

  static tooManyRequests(name: string, message?: string, details?: Record<string, unknown>) {
    return new GathEventApiError({
      code: "TOO_MANY_REQUESTS",
      name,
      message,
      details,
    });
  }

  static internalServerError(name: string, message?: string, details?: Record<string, unknown>) {
    return new GathEventApiError({
      code: "INTERNAL_SERVER_ERROR",
      name,
      message,
      details,
    });
  }
}

const createErrorResponse = (
  code: keyof typeof ERROR_CONFIG,
  name: string,
  message: string,
  details?: Record<string, unknown>,
): z.infer<typeof ErrorSchema> => ({
  success: false,
  error: {
    code,
    name,
    message,
    ...(details && { details }),
  },
});

const handleError = (err: Error, c: Context): Response => {
  if (err instanceof GathEventApiError) {
    const response = createErrorResponse(err.code, err.name, err.message, err.details);
    return c.json(response, err.status);
  }

  if (err instanceof HTTPException) {
    const code = statusToCode(err.status);
    const message = err.message || codeToDefaultMessage(code);
    const response = createErrorResponse(code, "HttpError", message);
    return c.json(response, err.status);
  }

  const message = err.message || codeToDefaultMessage("INTERNAL_SERVER_ERROR");
  const response = createErrorResponse("INTERNAL_SERVER_ERROR", "HttpError", message);
  return c.json(response, 500);
};

const handleNotFound = (c: Context): Response => {
  const response = createErrorResponse("NOT_FOUND", "HttpError", codeToDefaultMessage("NOT_FOUND"));
  return c.json(response, 404);
};

const handleZodError = (
  result:
    | {
        success: true;
        data: unknown;
      }
    | {
        success: false;
        error: ZodError;
      },
  c: Context,
) => {
  if (!result.success) {
    const zodError = result.error;

    const response = createErrorResponse(
      "BAD_REQUEST",
      "ValidationError",
      "The request data is invalid.",
      {
        errors: parseZodError(zodError),
      },
    );
    return c.json(response, 400);
  }
};

export { handleError, handleNotFound, handleZodError };
