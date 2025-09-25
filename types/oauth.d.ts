export interface OAuthConnexionResponse {
  auth_url: string; 
}

export interface OAuthCallbackResponse {
  message: string; 
  access_token?: string; 
  refresh_token?: string; 
  expires_in?: number; 
}

export interface OAuthDeconnexionResponse {
  message: string; 
}
