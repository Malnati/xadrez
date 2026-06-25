import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { locales, type Locale } from "@/i18n/locales";
import { useLocale } from "@/i18n/locale-provider";

export function LanguageGate() {
  const { setLocale, t } = useLocale();

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card
        data-testid="language-gate"
        className="parchment-panel gold-frame w-full max-w-xl border-primary/30"
      >
        <CardHeader className="text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-primary/40 bg-primary/15 text-primary shadow-glow">
            <Crown aria-hidden="true" />
          </div>
          <CardTitle className="font-display text-4xl">
            {t("app.title")}
          </CardTitle>
          <CardDescription className="text-base">
            {t("language.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {locales.map((locale) => (
            <Button
              key={locale}
              data-testid={`language-${locale}`}
              size="lg"
              variant={locale === "pt-BR" ? "default" : "outline"}
              onClick={() => setLocale(locale)}
            >
              {t(`language.${locale}` as const, {
                language: t(`language.${locale}` as const),
              })}
            </Button>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
