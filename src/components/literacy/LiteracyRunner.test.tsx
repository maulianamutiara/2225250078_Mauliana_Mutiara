import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { literacyTasks } from '../../content/topic7';
import { trialFindings } from '../../content/trialFindings';
import { LiteracyRunner } from './LiteracyRunner';

describe('LiteracyRunner', () => {
  it('menampilkan "Kebiasaan baik" dari temuan uji coba di tahap terkait', () => {
    const l2 = literacyTasks.find((t) => t.id === 'L2')!;
    render(<LiteracyRunner tasks={[l2]} onRecord={() => {}} onComplete={() => {}} />);
    expect(screen.getByText(/Kebiasaan baik:/)).toBeInTheDocument();
    expect(screen.getByText(trialFindings.UC1.habit)).toBeInTheDocument();
  });

  it('konteks Asisten Belajar memuat kebiasaan tahap itu', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ reply: '{"pesan":"Coba baca lagi."}' }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    const l2 = literacyTasks.find((t) => t.id === 'L2')!;
    render(<LiteracyRunner tasks={[l2]} onRecord={() => {}} onComplete={() => {}} />);
    await user.click(screen.getByRole('button', { name: /Tanya Mediator/ }));
    await user.click(screen.getByRole('button', { name: 'Aku belum paham maksud soalnya' }));
    await screen.findByText(/Coba baca lagi/);
    const body = JSON.parse((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(body.context).toContain(trialFindings.UC1.aiGuidance);
    vi.unstubAllGlobals();
  });
});
