import { createContext, useContext, useEffect, useState, useRef } from "react";
import { parseAuthCallback } from "./twitch/auth";
import { getFollowers, getStream, getUser, getChannel, revokeToken, validateToken } from "./twitch/api";
import { connectEventSub } from "./twitch/eventsub";
import { shouldSpeak, speak } from "./tts";
import { loadSettings } from "./settings";

const TwitchContext = createContext(null);

const emptyStats = () => ({ total: 0, users: new Set() });

export function TwitchProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("disconnected");
  const [stats, setStats] = useState(emptyStats);
  const [user, setUser] = useState(null);
  const [stream, setStream] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [channel, setChannel] = useState(null);
  const wsRef = useRef(null);

  const clearChatMessages = () => {
    setMessages([]);
  };

  const logout = async () => {
    const token = sessionStorage.getItem("twitch_token");

    // Borramos el token local primero, así el logout no depende de la red
    sessionStorage.removeItem("twitch_token");

    wsRef.current?.close();
    wsRef.current = null;

    setStatus("disconnected");
    setUser(null);
    setStream(null);
    setFollowers(null);
    setChannel(null)
    setMessages([]);
    setStats(emptyStats());

    if (token) await revokeToken(token);
  };

  useEffect(() => {
    let cancelled = false;

    const callbackToken = parseAuthCallback();
    if (callbackToken) {
      sessionStorage.setItem("twitch_token", callbackToken);
    }

    const token = callbackToken || sessionStorage.getItem("twitch_token");

    if (token) {
      validateToken(token).then((data) => {
        // Si hubo logout mientras validaba, el token ya no está guardado
        if (!data || cancelled || !sessionStorage.getItem("twitch_token")) return;

        getUser(token).then((u) => {
          if (!cancelled) setUser(u);
        });

        wsRef.current = connectEventSub(token, data.user_id, (msg) => {
          setStats((prev) => ({
            total: prev.total + 1,
            users: new Set(prev.users).add(msg.user),
          }));
          setMessages((prev) => [...prev, msg].slice(-50));

          const settings = loadSettings();
          if (!shouldSpeak(msg, settings)) return;
          speak(msg.text, settings);
        });

        setStatus("connected");
      });
    }

    return () => {
      cancelled = true;
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const token = sessionStorage.getItem("twitch_token");

    const load = () => getStream(token, user.id).then(setStream);
    const loadFw = () => getFollowers(token, user.id).then(setFollowers);
    load();
    loadFw();
    getChannel(token, user.id).then(setChannel);

    const id = setInterval(load, 30000);
    const idFw = setInterval(loadFw, 60000);
    return () => {
      clearInterval(id);
      clearInterval(idFw);
    }
  }, [user]);

  return (
    <TwitchContext.Provider
      value={{ messages, status, stats, clearChatMessages, user, logout, stream, followers, channel }}
    >
      {children}
    </TwitchContext.Provider>
  );
}

export function useTwitch() {
  return useContext(TwitchContext);
}