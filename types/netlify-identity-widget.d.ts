declare module 'netlify-identity-widget' {
  export interface NetlifyIdentityUser {
    id: string;
    email: string;
    token?: {
      access_token: string;
      expires_in: number;
      token_type: string;
    };
  }

  export interface NetlifyIdentity {
    init: (options?: { APIUrl?: string; redirectUrl?: string }) => void;
    open: () => void;
    logout: () => void;
    currentUser: () => NetlifyIdentityUser | null;
    on: (event: 'login' | 'logout' | 'error', callback: (user?: NetlifyIdentityUser) => void) => void;
    off: (event: 'login' | 'logout' | 'error', callback: (user?: NetlifyIdentityUser) => void) => void;
  }

  const netlifyIdentity: NetlifyIdentity;
  export default netlifyIdentity;
}
