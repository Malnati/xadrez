import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";
import { LocaleProvider } from "./i18n/locale-provider";

function renderApp() {
  return render(
    <LocaleProvider>
      <App />
    </LocaleProvider>,
  );
}

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "";
  });

  it("requires a language before rendering the medieval chess shell", async () => {
    renderApp();

    expect(await screen.findByTestId("language-gate")).toBeInTheDocument();
    expect(screen.getByText("Xadrez Medieval")).toBeInTheDocument();
    expect(screen.queryByText("Jogador vs Computador")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("language-pt-BR"));

    expect(
      await screen.findByText("Jogador vs Computador"),
    ).toBeInTheDocument();
    expect(screen.getByText("Histórico")).toBeInTheDocument();
    expect(screen.getByText("Entrar")).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("pt-BR");
  });

  it("renders the shell from a saved English language", async () => {
    localStorage.setItem("xadrez_locale_v1", "en-US");

    renderApp();

    expect(await screen.findByText("Player vs Computer")).toBeInTheDocument();
    expect(screen.getByText("History")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("en-US");
  });
});
