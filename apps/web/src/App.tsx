import { useCallback, useEffect, useMemo, useState } from "react";
import { Crown, LogIn, RotateCcw, Shield, Swords } from "lucide-react";
import type { ClockPreset, GameMode, GameSnapshot } from "@xadrez/shared";
import { clockPresets } from "@xadrez/shared";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClockPanel } from "@/components/game/ClockPanel";
import { HistoryPanel } from "@/components/game/HistoryPanel";
import { MedievalBoard } from "@/components/game/MedievalBoard";
import { ModePanel } from "@/components/game/ModePanel";
import { LanguageGate } from "@/components/i18n/LanguageGate";
import { createLocalGame, legalTargets, playLocalMove } from "@/lib/game-state";
import {
  createRemoteGame,
  fetchHistory,
  getMe,
  getStoredToken,
  loginUrl,
  storeToken,
  type SessionUser,
} from "@/lib/api";
import { loadLocalHistory, saveLocalGame } from "@/lib/local-history";
import { createRoomClient, type RoomClient } from "@/lib/room-client";
import { useStockfish } from "@/lib/use-stockfish";
import { locales } from "@/i18n/locales";
import { useLocale } from "@/i18n/locale-provider";

type PlayerColor = "white" | "black";

export default function App() {
  const { locale, hasLocale, setLocale, t } = useLocale();
  const [mode, setMode] = useState<GameMode>("computer");
  const [clock, setClock] = useState<ClockPreset>(clockPresets[0]!);
  const [playerColor, setPlayerColor] = useState<PlayerColor>("white");
  const [snapshot, setSnapshot] = useState<GameSnapshot>(() =>
    createLocalGame("computer"),
  );
  const [selectedSquare, setSelectedSquare] = useState<string | undefined>();
  const [history, setHistory] = useState<GameSnapshot[]>(() =>
    loadLocalHistory(),
  );
  const [user, setUser] = useState<SessionUser | null>(null);
  const [roomCode, setRoomCode] = useState<string | undefined>();
  const [roomClient, setRoomClient] = useState<RoomClient | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const requestEngineMove = useStockfish();

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    if (url.pathname === "/auth/callback" && token) {
      storeToken(token);
      window.history.replaceState({}, "", "/");
    }
    if (getStoredToken()) {
      void getMe().then(setUser);
      void fetchHistory().then((remote) =>
        setHistory([...remote, ...loadLocalHistory()]),
      );
    }
  }, []);

  useEffect(() => {
    if (snapshot.status === "completed") {
      saveLocalGame(snapshot);
      setHistory((current) =>
        [snapshot, ...current.filter((game) => game.id !== snapshot.id)].slice(
          0,
          30,
        ),
      );
    }
  }, [snapshot]);

  const humanTurn = playerColor === "white" ? "w" : "b";
  const computerTurn = playerColor === "white" ? "b" : "w";

  useEffect(() => {
    if (
      snapshot.mode !== "computer" ||
      snapshot.turn !== computerTurn ||
      snapshot.status === "completed" ||
      isThinking
    )
      return;
    const timer = window.setTimeout(() => {
      setIsThinking(true);
      void requestEngineMove(snapshot.fen, 2)
        .then((move) => {
          setSnapshot((current) => playLocalMove(current, move));
        })
        .finally(() => setIsThinking(false));
    }, 650);
    return () => window.clearTimeout(timer);
  }, [
    computerTurn,
    isThinking,
    requestEngineMove,
    snapshot.fen,
    snapshot.mode,
    snapshot.status,
    snapshot.turn,
  ]);

  useEffect(() => {
    if (!roomClient || !roomCode) return;
    return roomClient.onMove((next) => setSnapshot(next));
  }, [roomClient, roomCode]);

  const targets = useMemo(
    () => (selectedSquare ? legalTargets(snapshot.fen, selectedSquare) : []),
    [selectedSquare, snapshot.fen],
  );
  const lastMove = snapshot.moves.at(-1);
  const turnColor =
    snapshot.turn === "w" ? t("color.white.lower") : t("color.black.lower");
  const playerColorLabel =
    playerColor === "white" ? t("color.white.lower") : t("color.black.lower");

  const startNewGame = useCallback(async () => {
    setSelectedSquare(undefined);
    setRoomCode(undefined);
    const remote = getStoredToken()
      ? await createRemoteGame(mode, clock)
      : null;
    setSnapshot(remote ?? createLocalGame(mode));
  }, [clock, mode]);

  const changeMode = useCallback((nextMode: GameMode) => {
    setMode(nextMode);
    setSelectedSquare(undefined);
    setRoomCode(undefined);
    if (nextMode !== "room") {
      setSnapshot(createLocalGame(nextMode));
    }
  }, []);

  const changePlayerColor = useCallback(
    (nextColor: PlayerColor) => {
      setPlayerColor(nextColor);
      setSelectedSquare(undefined);
      if (mode === "computer") {
        setSnapshot(createLocalGame("computer"));
      }
    },
    [mode],
  );

  const createRoom = useCallback(async () => {
    const client = roomClient ?? createRoomClient();
    setRoomClient(client);
    try {
      const room = await client.createRoom(clock);
      setMode("room");
      setRoomCode(room.code);
      setSnapshot(room.snapshot);
    } catch {
      const local = createLocalGame("room");
      setRoomCode("LOCAL");
      setSnapshot(local);
    }
  }, [clock, roomClient]);

  const handleSquareClick = useCallback(
    (square: string) => {
      if (isThinking || snapshot.status === "completed") return;
      if (snapshot.mode === "computer" && snapshot.turn !== humanTurn) return;
      if (!selectedSquare) {
        if (legalTargets(snapshot.fen, square).length > 0)
          setSelectedSquare(square);
        return;
      }
      if (selectedSquare === square) {
        setSelectedSquare(undefined);
        return;
      }
      if (!targets.includes(square)) {
        if (legalTargets(snapshot.fen, square).length > 0)
          setSelectedSquare(square);
        return;
      }
      const move = { from: selectedSquare, to: square, promotion: "q" };
      const next = playLocalMove(snapshot, move);
      setSnapshot(next);
      setSelectedSquare(undefined);
      if (roomClient && roomCode && roomCode !== "LOCAL") {
        roomClient.sendMove(roomCode, {
          from: move.from,
          to: move.to,
          promotion: "q",
          whiteTimeLeft: next.whiteTimeLeft,
          blackTimeLeft: next.blackTimeLeft,
        });
      }
    },
    [
      humanTurn,
      isThinking,
      roomClient,
      roomCode,
      selectedSquare,
      snapshot,
      targets,
    ],
  );

  if (!hasLocale) return <LanguageGate />;

  return (
    <main className="min-h-screen p-4 lg:p-6">
      <div className="mx-auto flex max-w-[1680px] flex-col gap-4">
        <header className="gold-frame flex flex-col gap-4 rounded-3xl bg-background/55 px-5 py-4 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-primary/40 bg-primary/15 text-primary shadow-glow">
              <Crown aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="font-display text-3xl font-bold tracking-wide md:text-4xl">
                {t("app.title")}
              </h1>
              <p
                data-testid="turn-status"
                className="text-sm text-muted-foreground"
              >
                {t("status.turn", { color: turnColor })} ·{" "}
                {isThinking ? t("status.thinking") : t("status.ready")}
              </p>
              {mode === "computer" ? (
                <p className="text-sm font-medium text-primary">
                  {t("color.youPlay", { color: playerColorLabel })}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="gap-2">
              <Shield aria-hidden="true" /> {t("header.activePosition")}
            </Badge>
            <Button variant="outline" onClick={startNewGame}>
              <RotateCcw data-icon="inline-start" aria-hidden="true" />
              {t("header.newGame")}
            </Button>
            <label className="sr-only" htmlFor="language-switcher">
              {t("language.switcherLabel")}
            </label>
            <select
              id="language-switcher"
              data-testid="language-switcher"
              aria-label={t("language.switcherLabel")}
              value={locale}
              onChange={(event) =>
                setLocale(event.target.value as typeof locale)
              }
              className="h-10 rounded-md border border-input bg-background/70 px-3 py-2 text-sm font-medium text-foreground shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
            >
              {locales.map((option) => (
                <option key={option} value={option}>
                  {t(`language.${option}` as const)}
                </option>
              ))}
            </select>
            {user ? (
              <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-2">
                <Avatar className="size-8">
                  {user.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt="" />
                  ) : null}
                  <AvatarFallback>
                    {(user.name ?? user.email).slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {user.name ?? t("header.playerNameFallback")}
                </span>
              </div>
            ) : (
              <Button asChild>
                <a href={loginUrl()}>
                  <LogIn data-icon="inline-start" aria-hidden="true" />
                  {t("auth.signIn")}
                </a>
              </Button>
            )}
          </div>
        </header>

        <section className="grid gap-4 xl:grid-cols-[340px_minmax(520px,1fr)_380px]">
          <ModePanel
            mode={mode}
            clock={clock}
            playerColor={playerColor}
            roomCode={roomCode}
            onMode={changeMode}
            onClock={setClock}
            onPlayerColor={changePlayerColor}
            onNewGame={startNewGame}
            onCreateRoom={createRoom}
          />

          <div className="flex flex-col gap-4">
            <div className="gold-frame rounded-[2.25rem] bg-background/45 p-4 backdrop-blur">
              <MedievalBoard
                fen={snapshot.fen}
                selectedSquare={selectedSquare}
                legalTargets={targets}
                lastMove={lastMove}
                onSquareClick={handleSquareClick}
              />
            </div>
            <ClockPanel
              white={snapshot.whiteTimeLeft}
              black={snapshot.blackTimeLeft}
              turn={snapshot.turn}
            />
          </div>

          <HistoryPanel
            current={snapshot}
            history={history}
            onReplay={setSnapshot}
          />
        </section>

        <footer className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-border/60 bg-background/35 px-4 py-3 text-sm text-muted-foreground">
          <Swords aria-hidden="true" /> {t("app.footer")}
        </footer>
      </div>
    </main>
  );
}
