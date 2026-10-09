import { useState, useEffect } from "react";
import { loadSettings, saveSettings } from "../settings";
import { speak } from "../tts";

export const Ajustes = () => {
  const [settings, setSettings] = useState(loadSettings);
  const [ignoredText, setIgnoredText] = useState(
    settings.ignoredUsers.join(", "),
  );
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const load = () => setVoices(speechSynthesis.getVoices());
    load();
    speechSynthesis.addEventListener("voiceschanged", load);
    return() => speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  const update = (key, value) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveSettings(next);
  };

  const saveIgnored = () => {
    const names = ignoredText
      .split(",")
      .map((name) => name.trim().toLowerCase())
      .filter((name) => name.length > 0);
    update("ignoredUsers", names);
  };

  const options = [
    { value: "all", label: "Todos" },
    { value: "subs", label: "Solo suscriptores" },
    { value: "mods", label: "Solo moderadores" },
    { value: "subsAndMods", label: "Suscriptores y moderadores" },
  ];

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={settings.readBots}
          onChange={(e) => update("readBots", e.target.checked)}
        />
        Leer Mensajes de bots
      </label>
      <label>
        <input
          type="checkbox"
          checked={settings.readCommands}
          onChange={(e) => update("readCommands", e.target.checked)}
        />
        Leer comandos
      </label>
      <textarea
        value={ignoredText}
        onChange={(e) => setIgnoredText(e.target.value)}
        onBlur={saveIgnored}
        placeholder="usuario1, usuario2, bot1, bot2..."
      />

      <div>
        {options.map((o) => {
          return (
            <label key={o.value}>
              <input
                type="radio"
                name="whoReads"
                checked={settings.whoReads === o.value}
                onChange={() => update("whoReads", o.value)}
              />
              {o.label}
            </label>
          );
        })}
      </div>

      <div>
        <label>
            Volumen: {Math.round(settings.volume * 100)}%
            <input 
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.volume}
                onChange={(e) => update("volume", Math.round(Number(e.target.value) * 100) / 100)}
            />
        </label>
        <label>
            Velocidad: {settings.rate.toFixed(1)}X
            <input 
                type="range"
                min="0.5"
                max="2"
                step="0.5"
                value={settings.rate}
                onChange={(e) => update("rate", Number(e.target.value))} 
            />
        </label>
        <select
            value={settings.voiceName}
            onChange={(e) => update("voiceName", e.target.value)}
        >
            <option value="">Voz por defecto</option>
            {voices.map((v) => (
                <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
            ))}
        </select>
        <button onClick={() => {speak("Hola, así suena mi voz uwu", settings)} }>Prueba</button>
      </div>
    </div>
  );
};
