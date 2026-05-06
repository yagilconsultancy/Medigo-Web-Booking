const API_VERSION = 'v1';

// API Routes Specification
export const ROUTES_SPEC = {
  // Base
  ping: `/${API_VERSION}/ping`,

  // Auth (stubs for compile-time completeness)
  login: `/${API_VERSION}/auth/login`,
  logout: `/${API_VERSION}/auth/logout`,
  refresh: `/${API_VERSION}/auth/refresh`,

  // User
  getUserProfile: `/${API_VERSION}/auth/admin/profile`,

  // Support
  getSupportKpis: `/${API_VERSION}/auth/admin/support/kpis`,
  listSupportTickets: `/${API_VERSION}/auth/admin/support/tickets`,
  reopenTicket: (ticketId: string) =>
    `/${API_VERSION}/auth/admin/support/tickets/${ticketId}/reopen`,
  resolveTicket: (ticketId: string) =>
    `/${API_VERSION}/auth/admin/support/tickets/${ticketId}/resolve`,

  createPaymentIntent: `/${API_VERSION}/payments/mobile/payment-intent`,
} as const;

export const ROUTES = Object.fromEntries(
  Object.keys(ROUTES_SPEC).map((key) => [key, key])
) as {
  [K in keyof typeof ROUTES_SPEC]: K;
};

type DynamicRoute<T extends any[] = string[]> = (...args: T) => string;
type RouteValueParameters<T> = T extends DynamicRoute<infer P> ? P : [];

/**
 * Resolves a route key to a URL string.
 * If the route is a string, returns it directly.
 * If the route is a function, calls it with the given arguments.
 *
 * @param key - The key of the route to resolve
 * @param args - Parameters required if the route is a function
 * @returns The fully resolved URL string
 *
 * @example
 * // Static route
 * resolveRoute('ping') // Returns: '/v1/ping'
 *
 * @example
 * // Dynamic route
 * resolveRoute('getUserProfileInfo', '123') // Returns: '/v1/user/123/fetch-info'
 */
export function resolveRoute<K extends keyof typeof ROUTES_SPEC>(
  key: K,
  ...args: RouteValueParameters<(typeof ROUTES_SPEC)[K]>
): string {
  const route = ROUTES_SPEC[key];

  if (typeof route === 'string') {
    return route;
  }

  // @ts-ignore
  return route(...args);
}
