import { NextResponse } from 'next/server';

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Cria uma resposta de sucesso padronizada
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
  };
  
  if (message) {
    response.message = message;
  }
  
  return NextResponse.json(response, { status });
}

/**
 * Cria uma resposta de erro padronizada
 */
export function errorResponse(
  code: string,
  message: string,
  status: number = 400,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  const error: ApiErrorResponse['error'] = {
    code,
    message,
  };
  
  if (details !== undefined) {
    error.details = details;
  }
  
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  );
}

/**
 * Códigos de erro comuns
 */
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
} as const;
