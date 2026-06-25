import type { GameMode, GameSnapshot } from "@xadrez/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useLocale } from "@/i18n/locale-provider";
import type { MessageKey } from "@/i18n/messages";

const modeLabels: Record<GameMode, MessageKey> = {
  computer: "mode.computer.title",
  room: "mode.room.title",
  local: "mode.local.title",
};

export function HistoryPanel({
  current,
  history,
  onReplay,
}: {
  current: GameSnapshot;
  history: GameSnapshot[];
  onReplay(game: GameSnapshot): void;
}) {
  const { t, formatDate } = useLocale();
  const lastMoves = current.moves.slice(-12).reverse();
  const turnLabel = current.turn === "w" ? t("color.white") : t("color.black");

  return (
    <Card className="parchment-panel gold-frame h-full border-primary/30">
      <CardHeader>
        <CardTitle>{t("history.title")}</CardTitle>
        <CardDescription>{t("history.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 rounded-lg border border-border/70 bg-background/25 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold">
              {t("history.position")}
            </span>
            <Badge variant="outline">{turnLabel}</Badge>
          </div>
          <code className="break-all rounded-md bg-background/45 p-2 text-xs text-muted-foreground">
            {current.fen}
          </code>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">{t("history.moves")}</span>
          <ScrollArea className="h-44 rounded-lg border border-border/70 bg-background/25 p-3">
            <div data-testid="move-log" className="flex flex-col gap-2 pr-3">
              {lastMoves.length ? (
                lastMoves.map((move, index) => (
                  <div
                    key={`${move.san}-${index}`}
                    data-testid="move-log-entry"
                    className="flex items-center justify-between gap-2 rounded-md bg-secondary/45 px-3 py-2 text-sm"
                  >
                    <span>{move.san}</span>
                    <Badge variant={move.captured ? "default" : "outline"}>
                      {move.captured
                        ? t("history.capture")
                        : t("history.movePath", {
                            from: move.from,
                            to: move.to,
                          })}
                    </Badge>
                  </div>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  {t("history.noMoves")}
                </span>
              )}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">
            {t("history.savedGames")}
          </span>
          <ScrollArea className="h-40 rounded-lg border border-border/70 bg-background/25 p-3">
            <div className="flex flex-col gap-2 pr-3">
              {history.length ? (
                history.map((game) => (
                  <Button
                    key={game.id}
                    variant="outline"
                    className="h-auto justify-start py-2"
                    onClick={() => onReplay(game)}
                  >
                    <span className="flex flex-col items-start gap-1">
                      <span>{t(modeLabels[game.mode])}</span>
                      <span className="text-xs text-muted-foreground">
                        {t("history.moveCount", {
                          count: game.moves.length,
                          date: formatDate(game.createdAt),
                        })}
                      </span>
                    </span>
                  </Button>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  {t("history.signInHint")}
                </span>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
