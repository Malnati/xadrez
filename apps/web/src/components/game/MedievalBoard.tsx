import { useEffect, useMemo, useRef } from "react";
import { Application, Container, Graphics, Text, TextStyle } from "pixi.js";
import { cn } from "@/lib/utils";
import { piecesFromFen, toSquare } from "@/lib/game-state";

const pieceSymbols: Record<string, string> = {
  wk: "♔",
  wq: "♕",
  wr: "♖",
  wb: "♗",
  wn: "♘",
  wp: "♙",
  bk: "♚",
  bq: "♛",
  br: "♜",
  bb: "♝",
  bn: "♞",
  bp: "♟",
};

type Props = {
  fen: string;
  selectedSquare?: string;
  legalTargets: string[];
  lastMove?: { from: string; to: string; captured?: string };
  onSquareClick(square: string): void;
  className?: string;
};

export function MedievalBoard({
  fen,
  selectedSquare,
  legalTargets,
  lastMove,
  onSquareClick,
  className,
}: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const clickRef = useRef(onSquareClick);
  clickRef.current = onSquareClick;

  const pieces = useMemo(() => piecesFromFen(fen), [fen]);
  const boardSquares = useMemo(
    () =>
      Array.from({ length: 64 }, (_, index) =>
        toSquare(index % 8, Math.floor(index / 8)),
      ),
    [],
  );

  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current;
    if (!host) return;

    const app = new Application();
    appRef.current = app;

    void app
      .init({
        width: 720,
        height: 720,
        backgroundAlpha: 0,
        antialias: true,
        resolution: Math.min(window.devicePixelRatio, 2),
      })
      .then(() => {
        if (cancelled || !hostRef.current) {
          safeDestroy(app);
          return;
        }
        const canvas = getCanvas(app);
        if (!canvas) return;
        hostRef.current.appendChild(canvas);
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.display = "block";
        drawBoard(
          app,
          pieces,
          selectedSquare,
          legalTargets,
          lastMove,
          (square) => clickRef.current(square),
        );
      });

    return () => {
      cancelled = true;
      safeDestroy(app);
      appRef.current = null;
    };
  }, []);

  useEffect(() => {
    const app = appRef.current;
    if (!app) return;
    drawBoard(app, pieces, selectedSquare, legalTargets, lastMove, (square) =>
      clickRef.current(square),
    );
  }, [pieces, selectedSquare, legalTargets, lastMove]);

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-[2rem] border border-primary/40 bg-[#2a1609] p-3 shadow-insetWood",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(250,202,122,0.16),transparent_48%)]" />
      <div
        ref={hostRef}
        className="relative z-10 size-full overflow-hidden rounded-[1.35rem]"
        aria-label="Tabuleiro de xadrez medieval"
      />
      <div
        className="absolute inset-3 z-20 grid grid-cols-8 grid-rows-8 overflow-hidden rounded-[1.35rem]"
        aria-label="Casas do tabuleiro"
      >
        {boardSquares.map((square) => (
          <button
            key={square}
            type="button"
            aria-label={`Casa ${square}`}
            data-square={square}
            data-testid={`board-square-${square}`}
            className="min-h-0 min-w-0 bg-transparent outline-none transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={() => onSquareClick(square)}
          />
        ))}
      </div>
      {lastMove?.captured ? (
        <div className="pointer-events-none absolute left-1/2 top-10 z-20 -translate-x-1/2 rounded-full border border-primary/50 bg-background/80 px-4 py-1 font-display text-sm text-primary shadow-glow">
          Captura!
        </div>
      ) : null}
    </div>
  );
}

function getCanvas(app: Application): HTMLCanvasElement | undefined {
  try {
    const candidate = app as unknown as {
      canvas?: HTMLCanvasElement;
      view?: HTMLCanvasElement;
    };
    return candidate.canvas ?? candidate.view;
  } catch {
    return undefined;
  }
}

function safeDestroy(app: Application) {
  try {
    app.destroy(true);
  } catch {
    getCanvas(app)?.remove();
  }
}

function drawBoard(
  app: Application,
  pieces: ReturnType<typeof piecesFromFen>,
  selectedSquare: string | undefined,
  legalTargets: string[],
  lastMove: Props["lastMove"],
  onSquareClick: (square: string) => void,
) {
  app.stage.removeChildren();
  const board = new Container();
  app.stage.addChild(board);
  const size = 720;
  const cell = size / 8;

  const boardBg = new Graphics()
    .roundRect(0, 0, size, size, 28)
    .fill({ color: 0x2d1608 });
  board.addChild(boardBg);

  for (let rank = 0; rank < 8; rank += 1) {
    for (let file = 0; file < 8; file += 1) {
      const square = toSquare(file, rank);
      const isLight = (rank + file) % 2 === 0;
      const color = isLight ? 0xb98142 : 0x5b2e13;
      const tile = new Graphics()
        .rect(file * cell, rank * cell, cell, cell)
        .fill({ color });
      tile.eventMode = "static";
      tile.cursor = "pointer";
      tile.on("pointertap", () => onSquareClick(square));
      board.addChild(tile);

      if (
        selectedSquare === square ||
        legalTargets.includes(square) ||
        lastMove?.from === square ||
        lastMove?.to === square
      ) {
        const glowColor =
          selectedSquare === square
            ? 0xf8d27b
            : legalTargets.includes(square)
              ? 0x72d06c
              : 0xef9b45;
        const highlight = new Graphics()
          .rect(file * cell + 6, rank * cell + 6, cell - 12, cell - 12)
          .stroke({ width: 5, color: glowColor, alpha: 0.82 });
        board.addChild(highlight);
      }
    }
  }

  pieces.forEach((piece) => {
    const file = piece.square.charCodeAt(0) - 97;
    const rank = 8 - Number(piece.square[1]);
    const isWhite = piece.color === "w";
    const style = new TextStyle({
      fontFamily: "Georgia",
      fontSize: 58,
      fill: isWhite ? 0xf8e6c6 : 0x241008,
      stroke: { color: isWhite ? 0x5a2c13 : 0xd9a45d, width: 3 },
      dropShadow: { color: 0x000000, alpha: 0.45, blur: 4, distance: 4 },
    });
    const text = new Text({
      text: pieceSymbols[`${piece.color}${piece.type}`] ?? "?",
      style,
    });
    text.anchor.set(0.5);
    text.x = file * cell + cell / 2;
    text.y = rank * cell + cell / 2 + 2;
    board.addChild(text);
  });

  if (lastMove?.captured) {
    const file = lastMove.to.charCodeAt(0) - 97;
    const rank = 8 - Number(lastMove.to[1]);
    const cx = file * cell + cell / 2;
    const cy = rank * cell + cell / 2;
    for (let i = 0; i < 10; i += 1) {
      const angle = (Math.PI * 2 * i) / 10;
      const spark = new Graphics()
        .moveTo(cx, cy)
        .lineTo(cx + Math.cos(angle) * 44, cy + Math.sin(angle) * 44)
        .stroke({ width: 3, color: 0xffd36a, alpha: 0.8 });
      board.addChild(spark);
    }
  }
}
