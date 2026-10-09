export const DEFAULT_SETTINGS = {
  whoReads: "all",
  readBots: false,
  readCommands: false,
  ignoredUsers: [],
  voiceName: "",
  volume: 0.3,
  rate: 1,
};

const STORAGE_KEY = 'chatvoz_settings';

export function loadSettings() {
  const raw = localStorage.getItem(STORAGE_KEY)

  if(!raw) return DEFAULT_SETTINGS;
  try {
    const settingsSaved = JSON.parse(raw)
    return {...DEFAULT_SETTINGS, ...settingsSaved}
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
