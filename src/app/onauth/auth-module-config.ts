import { OAuthModuleConfig } from "angular-oauth2-oidc";

export const authModuleConfig: OAuthModuleConfig = {
  resourceServer: {
    allowedUrls: ["https://sso.nazan.ml/"],
    sendAccessToken: true,
  },
};
