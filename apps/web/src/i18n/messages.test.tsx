import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { LocaleProvider, useLocale } from "./locale-provider";
import { defaultLocale, locales } from "./locales";
import { messages, translate } from "./messages";

describe("i18n messages", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "";
  });

  it("keeps all locales with the same message keys", () => {
    const baseKeys = Object.keys(messages[defaultLocale]).sort();

    for (const locale of locales) {
      expect(Object.keys(messages[locale]).sort()).toEqual(baseKeys);
    }
  });

  it("falls back to Portuguese when no language is stored", () => {
    const { result } = renderHook(() => useLocale(), {
      wrapper: LocaleProvider,
    });

    expect(result.current.locale).toBe("pt-BR");
    expect(result.current.hasLocale).toBe(false);
    expect(result.current.t("auth.signIn")).toBe("Entrar");
    expect(document.documentElement.lang).toBe("pt-BR");
  });

  it("persists selected language and updates document lang", () => {
    const { result } = renderHook(() => useLocale(), {
      wrapper: LocaleProvider,
    });

    act(() => result.current.setLocale("es-419"));

    expect(result.current.locale).toBe("es-419");
    expect(result.current.hasLocale).toBe(true);
    expect(localStorage.getItem("xadrez_locale_v1")).toBe("es-419");
    expect(document.documentElement.lang).toBe("es-419");
    expect(result.current.t("history.title")).toBe("Historial");
  });

  it("interpolates parameters in translated messages", () => {
    expect(translate("en-US", "status.turn", { color: "White" })).toBe(
      "White to move",
    );
    expect(translate("es-419", "color.youPlay", { color: "blancas" })).toBe(
      "Juegas con blancas",
    );
  });
});
