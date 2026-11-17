import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { allProblems } from '../../content';
import { misconceptionMessages } from '../../content/feedback';
import type { Problem } from '../../content/types';
import { ProblemView } from './ProblemView';
import { useAiSettings } from '../../store/aiSettings';

const byId = (id: string) => allProblems.find((p) => p.id === id) as Problem;

describe('ProblemView', () => {
  it('pilihan ganda: salah → umpan balik khusus + hint, lalu benar', async () => {
    const user = userEvent.setup();
    const onDone = vi.fn();
    render(<ProblemView problem={byId('P3-1')} onDone={onDone} />);

    await user.click(screen.getByRole('radio', { name: /\(1, 2\)/ }));
    await user.click(screen.getByRole('button', { name: /Cek Jawaban/ }));
    expect(screen.getByText(/Urutannya terbalik/)).toBeInTheDocument();
    expect(screen.getByText(/Hint 1:/)).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: /\(2, 1\)/ }));
    await user.click(screen.getByRole('button', { name: /Cek Jawaban/ }));
    expect(screen.getByText('Benar')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Lanjut/ }));
    expect(onDone).toHaveBeenCalledWith(expect.objectContaining({ correct: true, tries: 2, hintsUsed: 1 }));
  });

  it('pasangan berurutan: menyusun jawaban benar dengan tombol A lalu B', async () => {
    const user = userEvent.setup();
    render(<ProblemView problem={byId('P3-4')} onDone={() => {}} />);
    const pick = async (a: string, b: string) => {
      await user.click(screen.getAllByRole('button', { name: a })[0]);
      const bButtons = screen.getAllByRole('button', { name: b });
      await user.click(bButtons[bButtons.length - 1]);
    };
    await pick('2', '4');
    await pick('3', '6');
    await pick('4', '8');
    await user.click(screen.getByRole('button', { name: /Cek Jawaban/ }));
    expect(screen.getByText('Benar')).toBeInTheDocument();
  });

  it('pasangan yang tidak memenuhi aturan memunculkan pesan M6', async () => {
    const user = userEvent.setup();
    render(<ProblemView problem={byId('P3-4')} onDone={() => {}} />);
    await user.click(screen.getAllByRole('button', { name: '2' })[0]);
    const six = screen.getAllByRole('button', { name: '6' });
    await user.click(six[six.length - 1]);
    await user.click(screen.getByRole('button', { name: /Cek Jawaban/ }));
    expect(screen.getByText(misconceptionMessages.M6)).toBeInTheDocument();
  });

  it('gagal 3 kali → pembahasan muncul dan boleh lanjut', async () => {
    const user = userEvent.setup();
    const onDone = vi.fn();
    render(<ProblemView problem={byId('H0-1')} onDone={onDone} />);
    for (let i = 0; i < 3; i++) {
      await user.click(screen.getByRole('radio', { name: /4/ }));
      await user.click(screen.getByRole('button', { name: /Cek Jawaban/ }));
    }
    expect(screen.getByText(/Pembahasan/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Lanjut/ }));
    expect(onDone).toHaveBeenCalledWith(expect.objectContaining({ correct: false, tries: 3 }));
  });

  it('Mediator: tanpa kunci menampilkan petunjuk ke Pengaturan', async () => {
    useAiSettings.getState().clearKey();
    const user = userEvent.setup();
    render(<ProblemView problem={byId('P2-3')} onDone={() => {}} />);
    await user.click(screen.getByRole('button', { name: /Tanya Mediator/ }));
    expect(screen.getByText(/Mediator AI belum aktif/)).toBeInTheDocument();
  });

  it('Mediator: mengirim pertanyaan tanpa kunci jawaban dan menampilkan balasan', async () => {
    useAiSettings.getState().save({ apiKey: 'sk-test' });
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ choices: [{ message: { content: 'Coba **cek** anggota 4 dulu. Kamu sedang mencari secara sistematis.' } }] }), {
        status: 200,
      }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    render(<ProblemView problem={byId('P2-3')} onDone={() => {}} />);
    await user.click(screen.getByRole('button', { name: /Tanya Mediator/ }));
    await user.click(screen.getByRole('button', { name: 'Aku bingung mulai dari mana' }));
    expect(await screen.findByText(/Coba cek anggota 4 dulu/)).toBeInTheDocument();
    const body = JSON.parse((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(JSON.stringify(body.messages)).not.toContain('(4, 2)');
    vi.unstubAllGlobals();
    useAiSettings.getState().clearKey();
  });

  it('isian angka (literasi): salah ditandai, lalu benar', async () => {
    const user = userEvent.setup();
    render(<ProblemView problem={byId('L1-T2')} onDone={() => {}} />);
    const fill = async (label: string, v: string) => {
      const input = screen.getByLabelText(label);
      await user.clear(input);
      await user.type(input, v);
    };
    await fill('Senin', '2');
    await fill('Rabu', '3');
    await fill('Kamis', '2');
    await fill('Jumat', '3');
    await user.click(screen.getByRole('button', { name: /Cek Jawaban/ }));
    expect(screen.getByText(/Ada 1 isian yang belum tepat/)).toBeInTheDocument();
    await fill('Rabu', '4');
    await user.click(screen.getByRole('button', { name: /Cek Jawaban/ }));
    expect(screen.getByText('Benar')).toBeInTheDocument();
  });

  it('pilih semua yang benar (literasi): pilihan berlebih diberi umpan balik khusus', async () => {
    const user = userEvent.setup();
    render(<ProblemView problem={byId('L2-T1')} onDone={() => {}} />);
    for (const name of ['Nama siswa', 'Minuman yang dipesan', 'Di aula']) {
      await user.click(screen.getByRole('checkbox', { name: new RegExp(name) }));
    }
    await user.click(screen.getByRole('button', { name: /Cek Jawaban/ }));
    expect(screen.getByText(/Tempat acara tidak dipakai/)).toBeInTheDocument();
    expect(screen.getByText(/Masih ada 1 pilihan benar/)).toBeInTheDocument();
  });

  it('diagram panah: ketuk A lalu ketuk B membuat panah', async () => {
    const user = userEvent.setup();
    const { container } = render(<ProblemView problem={byId('R1-2')} onDone={() => {}} />);
    const svg = container.querySelector('svg')!;
    const tap = (label: string) => {
      fireEvent.pointerDown(screen.getByText(label));
      fireEvent.pointerUp(svg);
    };
    tap('Ani');
    tap('Bakso');
    tap('Budi');
    tap('Mi Ayam');
    await user.click(screen.getByRole('button', { name: /Cek Jawaban/ }));
    expect(screen.getByText('Benar')).toBeInTheDocument();
  });
});
