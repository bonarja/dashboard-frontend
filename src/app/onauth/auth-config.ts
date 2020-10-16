import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';

export const authConfig: AuthConfig = {
  issuer: '...',
  clientId: environment.hydraClientId, // The "Auth Code + PKCE" client
  responseType: 'code',
  redirectUri: window.location.origin + environment.hydraRedirectionUri,
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  scope: 'openid profile', // Ask offline_access to support refresh token refreshes
  useSilentRefresh: true, // Needed for Code Flow to suggest using iframe-based refreshes
  silentRefreshTimeout: 20000, // For faster testing
  timeoutFactor: 0.8, // For faster testing
  sessionChecksEnabled: true,
  showDebugInformation: true, // Also requires enabling "Verbose" level in devtools
  clearHashAfterLogin: false, // https://github.com/manfredsteyer/angular-oauth2-oidc/issues/457#issuecomment-431807040,
  nonceStateSeparator: 'semicolon', // Real semicolon gets mangled by IdentityServer's URI encoding
  postLogoutRedirectUri:
    window.location.origin + environment.hydraRedirectionUri,
};
