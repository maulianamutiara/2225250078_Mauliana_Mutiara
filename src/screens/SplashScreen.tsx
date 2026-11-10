import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useProgress } from '../store/progress';

/** S1 — Layar pembuka + kode siswa (opsional, bukan nama asli). */
export function SplashScreen() {
  const navigate = useNavigate();
  const savedCode = useProgress((s) => s.studentCode);
  const setStudentCode = useProgress((s) => s.setStudentCode);
  const [code, setCode] = useState(savedCode ?? '');

  const start = (e: FormEvent) => {
    e.preventDefault();
    setStudentCode(code);
    navigate('/beranda');
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-8">
      <h1 className="text-center text-4xl font-bold">
        <span className="text-set-a">RelaSI</span> <span className="text-set-b">Pintar</span>
      </h1>
      <p className="mt-2 text-center text-muted">Belajar relasi lewat gambar dan latihan.</p>

      <form onSubmit={start} className="mt-10 space-y-3">
        <label htmlFor="kode" className="block font-bold">
          Kode siswa (boleh dikosongkan)
        </label>
        <input
          id="kode"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={10}
          autoComplete="off"
          placeholder="Contoh: S01"
          className="min-h-touch w-full rounded-xl border-2 border-line bg-surface px-4 text-lg uppercase focus:border-brand focus:outline-none"
        />
        <p className="text-sm text-muted">Pakai kode dari guru, bukan nama asli.</p>
        <Button type="submit" block>
          Mulai Belajar →
        </Button>
      </form>
    </main>
  );
}
