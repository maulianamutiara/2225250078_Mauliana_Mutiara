import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { HomeScreen } from './HomeScreen';
import { useProgress } from '../store/progress';

function renderHome() {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <HomeScreen />
    </MemoryRouter>,
  );
}

describe('HomeScreen (Peta Belajar)', () => {
  beforeEach(() => useProgress.getState().reset());

  it('menampilkan semua topik', () => {
    renderHome();
    expect(screen.getByText('Ingat Lagi: Himpunan')).toBeInTheDocument();
    expect(screen.getByText('Diagram Panah')).toBeInTheDocument();
    expect(screen.getByText('Soal Cerita')).toBeInTheDocument();
  });

  it('awalnya topik 2–6 terkunci', () => {
    renderHome();
    expect(screen.getAllByText('🔒 Terkunci')).toHaveLength(5);
    expect(screen.getByRole('link', { name: /Apa itu Relasi\?/ })).toBeInTheDocument();
  });

  it('topik 2 terbuka setelah topik 1 mendapat bintang', () => {
    useProgress.getState().setStars('1', 2);
    renderHome();
    expect(screen.getByRole('link', { name: /Diagram Panah/ })).toBeInTheDocument();
    expect(screen.getAllByText('🔒 Terkunci')).toHaveLength(4);
  });

  it('membuka dan menutup modal Cara Belajar', async () => {
    const user = userEvent.setup();
    renderHome();
    await user.click(screen.getByRole('button', { name: /Cara Belajar/ }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Tutup/ }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
