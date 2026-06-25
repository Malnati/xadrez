import type { GameSnapshot } from '@xadrez/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export function HistoryPanel({ current, history, onReplay }: { current: GameSnapshot; history: GameSnapshot[]; onReplay(game: GameSnapshot): void }) {
  const lastMoves = current.moves.slice(-12).reverse();
  return (
    <Card className="parchment-panel gold-frame h-full border-primary/30">
      <CardHeader>
        <CardTitle>Histórico</CardTitle>
        <CardDescription>Partidas, lances e posição atual.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 rounded-lg border border-border/70 bg-background/25 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold">Posição</span>
            <Badge variant="outline">{current.turn === 'w' ? 'Brancas' : 'Pretas'}</Badge>
          </div>
          <code className="break-all rounded-md bg-background/45 p-2 text-xs text-muted-foreground">{current.fen}</code>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Lances</span>
          <ScrollArea className="h-44 rounded-lg border border-border/70 bg-background/25 p-3">
            <div className="flex flex-col gap-2 pr-3">
              {lastMoves.length ? lastMoves.map((move, index) => (
                <div key={`${move.san}-${index}`} className="flex items-center justify-between gap-2 rounded-md bg-secondary/45 px-3 py-2 text-sm">
                  <span>{move.san}</span>
                  <Badge variant={move.captured ? 'default' : 'outline'}>{move.captured ? 'Captura!' : move.from + '–' + move.to}</Badge>
                </div>
              )) : <span className="text-sm text-muted-foreground">Nenhum lance ainda.</span>}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Partidas salvas</span>
          <ScrollArea className="h-40 rounded-lg border border-border/70 bg-background/25 p-3">
            <div className="flex flex-col gap-2 pr-3">
              {history.length ? history.map((game) => (
                <Button key={game.id} variant="outline" className="h-auto justify-start py-2" onClick={() => onReplay(game)}>
                  <span className="flex flex-col items-start gap-1">
                    <span>{game.mode === 'computer' ? 'Jogador vs Computador' : game.mode === 'room' ? 'Sala por link' : 'Jogador vs Jogador'}</span>
                    <span className="text-xs text-muted-foreground">{game.moves.length} lances · {new Date(game.createdAt).toLocaleDateString('pt-BR')}</span>
                  </span>
                </Button>
              )) : <span className="text-sm text-muted-foreground">Entre para manter seu histórico entre dispositivos.</span>}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
