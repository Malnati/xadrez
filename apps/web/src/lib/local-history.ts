import type { GameSnapshot } from "@xadrez/shared";

const KEY = "xadrez_medieval_history_v1";

export function loadLocalHistory(): GameSnapshot[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as GameSnapshot[]) : [];
  } catch {
    return [];
  }
}

export function saveLocalGame(snapshot: GameSnapshot) {
  const next = [
    snapshot,
    ...loadLocalHistory().filter((game) => game.id !== snapshot.id),
  ].slice(0, 30);
  localStorage.setItem(KEY, JSON.stringify(next));
}
