import type React from "react";
import { Bot, Swords, Users } from "lucide-react";
import { clockPresets, type ClockPreset, type GameMode } from "@xadrez/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale } from "@/i18n/locale-provider";
import type { MessageKey } from "@/i18n/messages";

type PlayerColor = "white" | "black";

const clockLabelKeys: Record<ClockPreset["id"], MessageKey> = {
  "blitz-3-2": "clock.blitz-3-2",
  "rapid-10-0": "clock.rapid-10-0",
  "classic-30-0": "clock.classic-30-0",
};

export function ModePanel({
  mode,
  clock,
  playerColor,
  roomCode,
  onMode,
  onClock,
  onPlayerColor,
  onNewGame,
  onCreateRoom,
}: {
  mode: GameMode;
  clock: ClockPreset;
  playerColor: PlayerColor;
  roomCode?: string;
  onMode(mode: GameMode): void;
  onClock(clock: ClockPreset): void;
  onPlayerColor(color: PlayerColor): void;
  onNewGame(): void;
  onCreateRoom(): void;
}) {
  const { t } = useLocale();

  return (
    <Card className="parchment-panel gold-frame h-full border-primary/30">
      <CardHeader>
        <CardTitle>{t("mode.title")}</CardTitle>
        <CardDescription>{t("mode.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Tabs value={mode} onValueChange={(value) => onMode(value as GameMode)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="local">{t("mode.local.tab")}</TabsTrigger>
            <TabsTrigger value="room">{t("mode.room.tab")}</TabsTrigger>
            <TabsTrigger data-testid="mode-computer" value="computer">
              {t("mode.computer.tab")}
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="local"
            className="rounded-lg border border-border/70 bg-background/25 p-3"
          >
            <ModeCard
              icon={<Users aria-hidden="true" />}
              title={t("mode.local.title")}
              text={t("mode.local.text")}
            />
          </TabsContent>
          <TabsContent
            value="room"
            className="rounded-lg border border-border/70 bg-background/25 p-3"
          >
            <ModeCard
              icon={<Swords aria-hidden="true" />}
              title={t("mode.room.title")}
              text={t("mode.room.text")}
            />
          </TabsContent>
          <TabsContent
            value="computer"
            className="rounded-lg border border-border/70 bg-background/25 p-3"
          >
            <ModeCard
              icon={<Bot aria-hidden="true" />}
              title={t("mode.computer.title")}
              text={t("mode.computer.text")}
            />
          </TabsContent>
        </Tabs>

        {mode === "computer" ? (
          <div className="flex flex-col gap-2 rounded-lg border border-border/70 bg-background/25 p-3">
            <span className="text-sm font-semibold text-muted-foreground">
              {t("mode.playerColor")}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Button
                data-testid="player-color-white"
                variant={playerColor === "white" ? "default" : "outline"}
                onClick={() => onPlayerColor("white")}
              >
                {t("color.white")}
              </Button>
              <Button
                data-testid="player-color-black"
                variant={playerColor === "black" ? "default" : "outline"}
                onClick={() => onPlayerColor("black")}
              >
                {t("color.black")}
              </Button>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-muted-foreground">
            {t("mode.time")}
          </span>
          <div className="grid grid-cols-1 gap-2">
            {clockPresets.map((preset) => (
              <Button
                key={preset.id}
                variant={clock.id === preset.id ? "default" : "outline"}
                onClick={() => onClock(preset)}
              >
                {t(clockLabelKeys[preset.id] ?? "clock.blitz-3-2")}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button data-testid="new-game" size="lg" onClick={onNewGame}>
            {t("mode.title")}
          </Button>
          {mode === "room" ? (
            <Button variant="secondary" onClick={onCreateRoom}>
              {t("mode.createRoom")}
            </Button>
          ) : null}
          {roomCode ? (
            <Badge variant="secondary">
              {t("mode.roomCode", { code: roomCode })}
            </Badge>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function ModeCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-11 items-center justify-center rounded-lg border border-primary/40 bg-primary/15 text-primary">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <strong className="font-display text-lg">{title}</strong>
        <span className="text-sm text-muted-foreground">{text}</span>
      </div>
    </div>
  );
}
