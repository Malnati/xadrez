import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the medieval chess shell', async () => {
    render(<App />);
    expect(await screen.findByText('Xadrez Medieval')).toBeInTheDocument();
    expect(screen.getByText('Jogador vs Computador')).toBeInTheDocument();
    expect(screen.getByText('Histórico')).toBeInTheDocument();
    expect(screen.getByText('Entrar')).toBeInTheDocument();
  });
});
