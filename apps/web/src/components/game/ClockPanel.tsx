import { formatClock } from "@xadrez/shared";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/i18n/locale-provider";

export function ClockPanel({
  white,
  black,
  turn,
}: {
  white: number;
  black: number;
  turn: "w" | "b";
}) {
  const { t } = useLocale();

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="gold-frame bg-card/85">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">
              {t("color.white")}
            </span>
            <strong className="font-display text-2xl">
              {formatClock(white)}
            </strong>
          </div>
          {turn === "w" ? (
            <Badge>{t("clock.active")}</Badge>
          ) : (
            <Badge variant="outline">{t("clock.waiting")}</Badge>
          )}
        </CardContent>
      </Card>
      <Card className="gold-frame bg-card/85">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">
              {t("color.black")}
            </span>
            <strong className="font-display text-2xl">
              {formatClock(black)}
            </strong>
          </div>
          {turn === "b" ? (
            <Badge>{t("clock.active")}</Badge>
          ) : (
            <Badge variant="outline">{t("clock.waiting")}</Badge>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
