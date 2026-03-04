const DEFAULT_API_BASE_URL = 'http://localhost:5011';

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');
const ensureLeadingSlash = (value: string) => (value.startsWith('/') ? value : `/${value}`);
const normalizeGraphqlUrl = (value: string, graphqlPath: string) => {
  const trimmedValue = value.trim();
  try {
    const parsed = new URL(trimmedValue);
    if (parsed.pathname && parsed.pathname !== '/') {
      return trimTrailingSlash(parsed.toString());
    }
    return `${trimTrailingSlash(parsed.origin)}${graphqlPath}`;
  } catch {
    return trimTrailingSlash(trimmedValue);
  }
};

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;
const normalizedApiBaseUrl = trimTrailingSlash(rawApiBaseUrl);

const rawGraphqlUrl = import.meta.env.VITE_GRAPHQL_URL?.trim();
const graphqlPath = import.meta.env.VITE_GRAPHQL_PATH ?? '/graphql';

const normalizedGraphqlPath = ensureLeadingSlash(graphqlPath);

export const apiConfig = {
  restBaseUrl: normalizedApiBaseUrl,
  graphqlUrl: rawGraphqlUrl
    ? normalizeGraphqlUrl(rawGraphqlUrl, normalizedGraphqlPath)
    : `${normalizedApiBaseUrl}${normalizedGraphqlPath}`
};
