const KNOWN_BOTS = ["streamelements", "streamlabs"];

export function speak(text, settings) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-MX";
  utterance.volume = settings.volume;
  utterance.rate = settings.rate;
  
  const voice = speechSynthesis.getVoices().find((v) => v.name === settings.voiceName);
  if (voice) utterance.voice = voice;
  
  if (speechSynthesis.pending) return;
  speechSynthesis.speak(utterance);
}

export function shouldSpeak(msg, settings) {
  const isMod =
    msg.badges.includes("moderator") || msg.badges.includes("broadcaster");
  const isSub =
    msg.badges.includes("subscriber") || msg.badges.includes("founder");
  const isBot =
    KNOWN_BOTS.includes(msg.user.toLowerCase()) ||
    msg.badges.includes("bot-badge");

  if (!settings.readCommands && msg.text.startsWith("!")) return false;
  if (!settings.readBots && isBot) return false;
  if (settings.ignoredUsers.includes(msg.user.toLowerCase())) return false;

  if (settings.whoReads === "subs" && !isSub) return false;
  if (settings.whoReads === "mods" && !isMod) return false;
  if (settings.whoReads === "subsAndMods" && !isSub && !isMod) return false;

  return true;
}
