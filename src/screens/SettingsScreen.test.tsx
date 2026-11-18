import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SettingsScreen } from './SettingsScreen';

describe('SettingsScreen', () => {
  it('menampilkan kartu "Pasang di HP" dengan petunjuk pemasangan', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <SettingsScreen />
      </MemoryRouter>,
    );
    expect(screen.getByText('📲 Pasang di HP')).toBeInTheDocument();
    expect(screen.getByText(/Instal aplikasi/)).toBeInTheDocument();
    expect(screen.getByText(/tetap jalan tanpa internet/)).toBeInTheDocument();
  });
});
