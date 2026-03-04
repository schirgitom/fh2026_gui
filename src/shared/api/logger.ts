import type { AxiosRequestConfig, AxiosResponseHeaders, RawAxiosRequestHeaders } from 'axios';

type HeaderInput = RawAxiosRequestHeaders | AxiosResponseHeaders | undefined;

const API_LOG_PREFIX = '[API]';
const SENSITIVE_HEADERS = new Set(['authorization', 'cookie', 'set-cookie', 'x-api-key']);
const requestStartTimes = new WeakMap<AxiosRequestConfig, number>();

const now = () => new Date().toISOString();

const maskSensitiveValue = (key: string, value: unknown) => {
  return SENSITIVE_HEADERS.has(key.toLowerCase()) ? '[REDACTED]' : value;
};

const sanitizeHeaders = (headers: HeaderInput) => {
  if (!headers) {
    return undefined;
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(headers)) {
    sanitized[key] = maskSensitiveValue(key, value);
  }
  return sanitized;
};

const serializeParams = (params: unknown) => {
  if (params === undefined) {
    return undefined;
  }
  if (params instanceof URLSearchParams) {
    return params.toString();
  }
  return params;
};

const buildUrl = (config: AxiosRequestConfig) => {
  const base = config.baseURL ?? '';
  const path = config.url ?? '';

  if (!base) {
    return path;
  }
  if (!path) {
    return base;
  }
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedBase = base.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export const attachRequestStart = (config: AxiosRequestConfig) => {
  requestStartTimes.set(config, performance.now());
};

export const requestDurationMs = (config: AxiosRequestConfig) => {
  const startTime = requestStartTimes.get(config);
  if (!startTime) {
    return undefined;
  }
  return Math.round((performance.now() - startTime) * 100) / 100;
};

export const logRequest = (config: AxiosRequestConfig) => {
  const method = (config.method ?? 'GET').toUpperCase();
  const url = buildUrl(config);

  console.info(`${API_LOG_PREFIX} ${now()} -> ${method} ${url}`, {
    params: serializeParams(config.params),
    data: config.data,
    headers: sanitizeHeaders(config.headers)
  });
};

export const logResponse = (response: { config: AxiosRequestConfig; status: number; headers?: HeaderInput }) => {
  const method = (response.config.method ?? 'GET').toUpperCase();
  const url = buildUrl(response.config);

  console.info(`${API_LOG_PREFIX} ${now()} <- ${method} ${url} [${response.status}]`, {
    durationMs: requestDurationMs(response.config),
    headers: sanitizeHeaders(response.headers)
  });
};

export const logError = (error: {
  config?: AxiosRequestConfig;
  message: string;
  code?: string;
  response?: { status?: number; data?: unknown; headers?: HeaderInput };
}) => {
  const method = (error.config?.method ?? 'GET').toUpperCase();
  const url = error.config ? buildUrl(error.config) : 'unknown-url';

  console.error(`${API_LOG_PREFIX} ${now()} xx ${method} ${url} [${error.response?.status ?? 'NO_RESPONSE'}]`, {
    durationMs: error.config ? requestDurationMs(error.config) : undefined,
    code: error.code,
    message: error.message,
    responseData: error.response?.data,
    responseHeaders: sanitizeHeaders(error.response?.headers)
  });
};
