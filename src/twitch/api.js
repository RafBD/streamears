export async function validateToken(token) {
  const response = await fetch("https://id.twitch.tv/oauth2/validate", {
    headers: {
      Authorization: `OAuth ${token}`,
    },
  });

  if (!response.ok) {
    return null;
  }
  return await response.json();
}

export async function revokeToken(token) {
  const response = await fetch("https://id.twitch.tv/oauth2/revoke", {
    method: "POST",
    body: new URLSearchParams({
      client_id: import.meta.env.VITE_TWITCH_CLIENT_ID,
      token: token,
    }),
  });

  return response.ok;
}

export async function getUser(token) {
  const response = await fetch("https://api.twitch.tv/helix/users", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Client-Id": import.meta.env.VITE_TWITCH_CLIENT_ID,
    },
  });

  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data.data[0];
}

export async function getStream(token, userId) {
  const response = await fetch(
    `https://api.twitch.tv/helix/streams?user_id=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Client-Id": import.meta.env.VITE_TWITCH_CLIENT_ID,
      },
    },
  );

  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data.data[0] ?? null;
}

export async function getChannel(token, broadcasterId) {
  const response = await fetch(
    `https://api.twitch.tv/helix/channels?broadcaster_id=${broadcasterId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Client-Id": import.meta.env.VITE_TWITCH_CLIENT_ID,
      },
    },
  );

  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data.data[0];
}

export async function updateChannel(token, broadcasterId, changes) {
  try {
    const response = await fetch(
      `https://api.twitch.tv/helix/channels?broadcaster_id=${broadcasterId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-Id": import.meta.env.VITE_TWITCH_CLIENT_ID,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(changes)
      }
    );

    if (!response.ok) {
      return false;
    }

    return true;


  } catch {
    return false;
  }
}

export async function getFollowers(token, broadcasterId) {
  const response = await fetch(
    `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${broadcasterId}&first=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Client-Id": import.meta.env.VITE_TWITCH_CLIENT_ID,
      },
    },
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.total;
}

export async function subscribeToChat(token, userId, sessionId) {
  try {
    const response = await fetch(
      "https://api.twitch.tv/helix/eventsub/subscriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-Id": import.meta.env.VITE_TWITCH_CLIENT_ID,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "channel.chat.message",
          version: "1",
          condition: {
            broadcaster_user_id: userId,
            user_id: userId,
          },
          transport: {
            method: "websocket",
            session_id: sessionId,
          },
        }),
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error uwu: ", error);
  }
}
