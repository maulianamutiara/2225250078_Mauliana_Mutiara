interface SetViewProps {
  name: string;
  members: string[];
  color: 'A' | 'B';
}

/** Gambar sebuah himpunan beserta notasinya. */
export function SetView({ name, members, color }: SetViewProps) {
  const isA = color === 'A';
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`flex min-h-[120px] w-full max-w-xs flex-wrap content-center items-center justify-center gap-2 rounded-[40px] border-2 p-4 ${
          isA ? 'border-set-a bg-blue-50' : 'border-set-b bg-orange-50'
        }`}
      >
        {members.map((m) => (
          <span
            key={m}
            className={`rounded-full bg-white px-3 py-1 font-bold shadow-sm ${isA ? 'text-set-a' : 'text-set-b'}`}
          >
            {m}
          </span>
        ))}
      </div>
      <p className="text-lg">
        <span className={`font-bold ${isA ? 'text-set-a' : 'text-set-b'}`}>{name}</span> = {'{'}
        {members.join(', ')}
        {'}'}
      </p>
    </div>
  );
}
