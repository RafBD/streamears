import { useEffect } from "react";
import { useTwitch } from "../TwitchContext";
import { buildAuthUrl } from "../twitch/auth";
import { useRef } from "react";

const StatCard = ({ label, value }) => (
  <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
    <p className="text-xs uppercase text-zinc-400">{label}</p>
    <p className="mt-1 text-3xl font-bold">{value}</p>
  </div>
);

export const Dashboard = () => {
  const feedRef = useRef(null);

  const {
    messages,
    status,
    stats,
    clearChatMessages,
    user,
    logout,
    stream,
    followers,
    channel,
  } = useTwitch();

  const connected = status === "connected";
  const dotColor = connected ? "bg-green-500" : "bg-zinc-500";
  const label = connected ? "app conectada" : "app desconectada";

  useEffect(() => {
    const el = feedRef.current;

    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
    if (nearBottom) el.scrollTop = el.scrollHeight;

    if (el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div className="flex flex-col gap-6">
      {user && <h1 className="text-2xl font-bold">Hola {user.display_name}</h1>}

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="comentarios" value={stats.total} />
        <StatCard label="usuarios únicos" value={stats.users.size} />
        <StatCard label="seguidores" value={followers ?? "-"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* FEED EN VIVO (COMENTARIOS APARECEN AQUI) */}
        <section className="flex h-128 flex-col rounded-xl border border-zinc-800 bg-zinc-900/60">
          {/* ENCABEZADO */}
          <div className="flex items-center justify-between p-3 border-b border-b-zinc-800">
            <p className="font-semibold">
              Mi chat{" "}
              <span className="text-xs font-semibold inline-flex items-center justify-center w-6 h-6 bg-violet-600/20 rounded-full text-violet-300">
                {messages.length}
              </span>
            </p>
            <button
              className="text-zinc-500 hover:text-zinc-200 cursor-pointer text-sm"
              onClick={clearChatMessages}
            >
              Limpiar feed
            </button>
          </div>

          <div ref={feedRef} className="flex-1 overflow-y-auto p-3">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="font-medium text-zinc-400">Sin mensajes</p>
              </div>
            ) : (
              <ul>
                {messages.map((m) => (
                  <li
                    key={m.id}
                    className="rounded-lg px-3 py-1.5 hover:bg-zinc-800/50"
                  >
                    <strong>{m.user}: </strong>
                    {m.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="flex flex-col justify-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 self-start">
          <div className="flex flex-col justify-center gap-4">
            <p className="text-zinc-400 text-xs font-semibold uppercase">
              conexión
            </p>
            <div className="flex items-center gap-2  p-4 rounded-xl border border-zinc-800">
              <div>
                {user && (
                  <div>
                    <div className="flex items-center gap-2">
                      <img
                        src={user.profile_image_url}
                        alt={user.display_name}
                        className="h-10 w-10 rounded-full"
                      />
                      <span className="font-semibold">{user.display_name}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 ">
                <span className={`h-2 w-2 rounded-full ${dotColor}`} />
                <span className="text-sm text-zinc-300">{label}</span>
              </div>
            </div>

            <div className="flex items-center just gap-2">
              <p className="text-zinc-400 text-xs font-semibold uppercase">
                STREAM
              </p>
              {stream ? (
                <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-bold">
                  EN VIVO · {stream.viewer_count} viewers
                </span>
              ) : (
                <span className="rounded bg-zinc-800 px-2 py-0.5 font-bold text-xs text-zinc-500">
                  offline
                </span>
              )}
            </div>

            <button
              className="w-full rounded-lg bg-violet-900 py-2 font-semibold hover:bg-violet-700 cursor-pointer"
              onClick={() => {
                window.location.href = buildAuthUrl();
              }}
            >
              {connected ? "Reconectar" : "Iniciar Sesión con Twitch"}
            </button>
            {connected && (
              <button
                onClick={logout}
                className="w-full cursor-pointer rounded-lg border border-zinc-700 py-2 text-zinc-300 hover:bg-zinc-800"
              >
                Cerrar sesión
              </button>
            )}
          </div>
          
          <div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
              <p className="text-xs uppercase text-zinc-400">
                Configuración rápida del stream
              </p>
              <p className="mt-3 text-xs text-zinc-400">Título del stream</p>
              <p className="text-sm">{channel?.title ?? "-"}</p>
              <p className="mt-3 text-xs text-zinc-400">Categoría</p>
              <p className="text-sm">{channel?.game_name ?? "-"}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
