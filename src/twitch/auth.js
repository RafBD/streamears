export function buildAuthUrl() {

    const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_REDIRECT_URI;
    const state = crypto.randomUUID();

    sessionStorage.setItem('twitch_oauth_state', state);

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'token',
        scope: 'user:read:chat channel:manage:broadcast moderator:read:followers',
        state: state,
    });

    return `https://id.twitch.tv/oauth2/authorize?${params.toString()}`;
}

export function parseAuthCallback() {
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);

    const access_token = params.get('access_token');
    const returnedState = params.get('state');

    const savedState = sessionStorage.getItem('twitch_oauth_state');

    if(savedState !== returnedState || !access_token){
        return null;
    }

    sessionStorage.removeItem('twitch_oauth_state');
    window.history.replaceState(null, '', window.location.pathname);

    return access_token;
}