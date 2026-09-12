const API_VERSION = 'v1';

// API Routes Specification
export const ROUTES_SPEC = {
  // Base
  ping: `/${API_VERSION}/ping`,

  // Auth (stubs for compile-time completeness)
  register: `/${API_VERSION}/auth/register`,
  verifyOtp: `/${API_VERSION}/auth/verify-otp`,
  resendOtp: `/${API_VERSION}/auth/resend-otp`,
  login: `/${API_VERSION}/auth/login`,
  refresh: `/${API_VERSION}/auth/refresh`,
  logout: `/${API_VERSION}/auth/logout`,
  changePassword: `/${API_VERSION}/auth/change-password`,
  forgotPassword: `/${API_VERSION}/auth/forgot-password`,
  resetPassword: `/${API_VERSION}/auth/reset-password`,

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

  // Public account deletion (the URL published on the Google Play listing).
  requestAccountDeletion: `/${API_VERSION}/users/public/account-deletion/request`,
  verifyAccountDeletion: `/${API_VERSION}/users/public/account-deletion/verify`,
  resendAccountDeletionOtp: `/${API_VERSION}/users/public/account-deletion/resend-otp`,

  // Users (Me)
  getMyProfile: `/${API_VERSION}/users/me`,
  updateMyProfile: `/${API_VERSION}/users/me`,
  deleteMyProfile: `/${API_VERSION}/users/me`,
  userRideStat: `/${API_VERSION}/rides/rider/me/stats`,

  listEmergencyContacts: `/${API_VERSION}/users/me/emergency-contacts`,
  createEmergencyContact: `/${API_VERSION}/users/me/emergency-contacts`,
  deleteEmergencyContact: (contactId: string) =>
    `/${API_VERSION}/users/me/emergency-contacts/${contactId}`,

  getMyConsent: `/${API_VERSION}/users/me/consent`,
  updateMyConsent: `/${API_VERSION}/users/me/consent`,

  getOnboardingStatus: `/${API_VERSION}/users/me/onboarding`,
  advanceOnboarding: (step: string) =>
    `/${API_VERSION}/users/me/onboarding/${step}`,

  listMyDocuments: `/${API_VERSION}/users/me/documents`,
  uploadMyDocument: `/${API_VERSION}/users/me/documents`,
  getMyDocument: (documentId: string) =>
    `/${API_VERSION}/users/me/documents/${documentId}`,

  listPassengers: `/${API_VERSION}/users/me/passengers`,
  createPassenger: `/${API_VERSION}/users/me/passengers`,
  updatePassenger: (passengerId: string) =>
    `/${API_VERSION}/users/me/passengers/${passengerId}`,
  deletePassenger: (passengerId: string) =>
    `/${API_VERSION}/users/me/passengers/${passengerId}`,

  uploadAvatar: `/${API_VERSION}/users/me/avatar`,
  getAvatar: `/${API_VERSION}/users/me/avatar`,

  getSettings: `/${API_VERSION}/users/me/settings`,
  updateNotificationSettings: `/${API_VERSION}/users/me/settings/notifications`,
  updatePrivacySettings: `/${API_VERSION}/users/me/settings/privacy`,
  updateAppSettings: `/${API_VERSION}/users/me/settings/app`,

  listSavedLocations: `/${API_VERSION}/users/me/saved-locations`,
  createSavedLocation: `/${API_VERSION}/users/me/saved-locations`,
  getSavedLocation: (locationId: string) =>
    `/${API_VERSION}/users/me/saved-locations/${locationId}`,
  updateSavedLocation: (locationId: string) =>
    `/${API_VERSION}/users/me/saved-locations/${locationId}`,
  deleteSavedLocation: (locationId: string) =>
    `/${API_VERSION}/users/me/saved-locations/${locationId}`,
  reorderSavedLocations: `/${API_VERSION}/users/me/saved-locations/reorder`,

  // Rides
  createRide: `/${API_VERSION}/rides/`,
  getRideDetail: (rideId: string) => `/${API_VERSION}/rides/${rideId}`,
  cancelRide: (rideId: string) => `/${API_VERSION}/rides/${rideId}/cancel`,
  getRideFare: (rideId: string) => `/${API_VERSION}/rides/${rideId}/fare`,
  getRideRatings: (rideId: string) => `/${API_VERSION}/rides/${rideId}/rating`,
  submitRideRating: (rideId: string) =>
    `/${API_VERSION}/rides/${rideId}/rating`,
  rebookRide: (rideId: string) => `/${API_VERSION}/rides/${rideId}/rebook`,
  shareRide: (rideId: string) => `/${API_VERSION}/rides/${rideId}/share`,
  transitionRideStatus: (rideId: string) =>
    `/${API_VERSION}/rides/${rideId}/status`,
  getRideTimeline: (rideId: string) =>
    `/${API_VERSION}/rides/${rideId}/timeline`,
  getDriverContact: (rideId: string) =>
    `/${API_VERSION}/rides/${rideId}/driver-contact`,

  // Rides analytics
  ridesAnalyticsOverview: `/${API_VERSION}/rides/analytics/overview`,
  ridesAnalyticsTripVolume: `/${API_VERSION}/rides/analytics/trip-volume`,
  ridesAnalyticsTripStatus: `/${API_VERSION}/rides/analytics/trip-status`,
  ridesAnalyticsTransportDistribution: `/${API_VERSION}/rides/analytics/transport-distribution`,
  ridesAnalyticsBookingChannels: `/${API_VERSION}/rides/analytics/booking-channels`,
  ridesAnalyticsServiceQuality: `/${API_VERSION}/rides/analytics/service-quality`,
  ridesAnalyticsTopFacilities: `/${API_VERSION}/rides/analytics/top-facilities`,
  ridesAnalyticsTopFleetPartners: `/${API_VERSION}/rides/analytics/top-fleet-partners`,
  ridesAnalyticsRecentActivity: `/${API_VERSION}/rides/analytics/recent-activity`,

  // Public rides booking flow
  publicBookingFlowConfig: `/${API_VERSION}/rides/public/booking-flow/config`,
  createGuestSession: `/${API_VERSION}/rides/public/guest-sessions`,
  getGuestSession: (sessionId: string) =>
    `/${API_VERSION}/rides/public/guest-sessions/${sessionId}`,
  createGuestBooking: `/${API_VERSION}/rides/public/guest-bookings`,
  getGuestBooking: (rideId: string, sessionId: string) =>
    `/${API_VERSION}/rides/public/guest-bookings/${rideId}?session_id=${encodeURIComponent(
      sessionId
    )}`,
  guestRideList: (sessionId: string) =>
    `/${API_VERSION}/rides/public/guest-bookings?session_id=${encodeURIComponent(
      sessionId
    )}`,
  guestPaymentIntent: `/${API_VERSION}/payments/guest/payment-intent`,

  // Recurring rides
  listRecurringRides: `/${API_VERSION}/rides/recurring/`,
  createRecurringRide: `/${API_VERSION}/rides/recurring/`,
  deactivateRecurringRide: (recurringRideId: string) =>
    `/${API_VERSION}/rides/recurring/${recurringRideId}`,

  // Rider rides
  getMyRides: `/${API_VERSION}/rides/rider/me`,
  getMyActiveRide: `/${API_VERSION}/rides/rider/me/active`,
  getRideOverview: `/${API_VERSION}/rides/rider/me/overview`,

  // Rides safety
  listSafetyReports: `/${API_VERSION}/rides/safety/reports`,
  createSafetyReport: `/${API_VERSION}/rides/safety/reports`,
  getVehicleChecklists: `/${API_VERSION}/rides/safety/vehicle-checklist`,
  submitVehicleChecklist: `/${API_VERSION}/rides/safety/vehicle-checklist`,

  // Fare Estimates
  riderFareEstimate: `/${API_VERSION}/payments/fare-estimate`,
  riderBaseFareEstimate: `/${API_VERSION}/payments/base-fare-estimate`,

  // Shared rides
  getSharedRide: (shareToken: string) =>
    `/${API_VERSION}/rides/shared/${shareToken}`,
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
