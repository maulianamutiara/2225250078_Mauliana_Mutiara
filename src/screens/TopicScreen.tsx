import { Link, useParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { findTopic } from '../content/topics';

/** Penampung sementara — isi topik (materi, contoh, latihan) dibangun di Fase 3–4. */
export function TopicScreen() {
  const { id } = useParams();
  const topic = findTopic(Number(id));

  return (
    <main className="mx-auto max-w-md px-4 py-6">
      <Link
        to="/beranda"
        className="inline-flex min-h-touch items-center font-bold text-brand hover:underline"
      >
        ← Peta Belajar
      </Link>
      <Card className="mt-4">
        {topic ? (
          <>
            <h1 className="text-2xl font-bold">{topic.title}</h1>
            <p className="mt-2 text-muted">Materi topik ini sedang disiapkan.</p>
          </>
        ) : (
          <h1 className="text-xl font-bold">Topik tidak ditemukan.</h1>
        )}
      </Card>
    </main>
  );
}
