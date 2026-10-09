import { subscribeToChat } from "./api";

export function connectEventSub(token, userId, onMessage) {
    // ws = websocket
    const ws = new WebSocket('wss://eventsub.wss.twitch.tv/ws');

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const message_type = message.metadata.message_type;

        if(message_type === 'session_welcome') {
            const session_id = message.payload.session.id;
            subscribeToChat(token, userId, session_id)
        }

        if(message_type === 'notification') {
            onMessage({ 
                user: message.payload.event.chatter_user_name,
                text: message.payload.event.message.text,
                badges: message.payload.event.badges.map(b => b.set_id),
                id: message.payload.event.message_id,
            })
        }
        
    };

    return ws;
}