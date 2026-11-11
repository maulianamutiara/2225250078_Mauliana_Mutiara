import { FAVORITE_SUBJECT, R } from './helpers';
import type { TopicContent } from './types';

/** Topik 1 — Apa itu Relasi? */
export const topic1: TopicContent = {
  topicId: 1,
  lesson: [
    {
      text: ['Ani suka Matematika.', 'Budi suka IPA.', 'Candra suka Seni Budaya.'],
      visual: { kind: 'arrow', relation: FAVORITE_SUBJECT, reveal: 0 },
    },
    {
      text: [
        'Kata "suka" menghubungkan anggota dua himpunan.',
        'Lihat panahnya muncul satu per satu.',
      ],
      visual: { kind: 'arrow', relation: FAVORITE_SUBJECT, animate: true },
    },
    {
      text: [
        'Relasi adalah aturan yang memasangkan anggota himpunan A dengan anggota himpunan B.',
      ],
      visual: { kind: 'arrow', relation: FAVORITE_SUBJECT },
    },
    {
      text: [
        'Himpunan A disebut himpunan asal.',
        'Himpunan B disebut himpunan tujuan atau kawan.',
        'Panah selalu berangkat dari A menuju B.',
      ],
      visual: { kind: 'arrow', relation: FAVORITE_SUBJECT },
    },
  ],
  problems: [
    {
      id: 'R1-1',
      type: 'mcq',
      level: 1,
      prompt: 'Ani suka bakso. Budi suka mi ayam. Kata apa yang menjadi aturan relasinya?',
      options: ['suka', 'Ani', 'bakso'],
      answer: 0,
      optionFeedback: {
        1: 'Ani adalah anggota himpunan, bukan aturannya.',
        2: 'Bakso adalah anggota himpunan, bukan aturannya.',
      },
      hints: [
        'Aturan relasi adalah kata yang menghubungkan.',
        'Kata apa yang ada di antara "Ani" dan "bakso"?',
      ],
      explanation: ['Kata "suka" menghubungkan siswa dengan makanan.', 'Jadi, aturannya adalah "suka".'],
    },
    {
      id: 'R1-2',
      type: 'arrow',
      level: 1,
      prompt: 'Ani suka bakso. Budi suka mi ayam. Tarik panah relasi "suka".',
      relation: R(['Ani', 'Budi'], ['Bakso', 'Mi Ayam'], 'suka', [
        ['Ani', 'Bakso'],
        ['Budi', 'Mi Ayam'],
      ]),
      hints: ['Baca kalimatnya satu per satu.', 'Mulai dari Ani. Tarik panah ke makanan yang Ani suka.'],
      explanation: ['Ani suka bakso: panah Ani → Bakso.', 'Budi suka mi ayam: panah Budi → Mi Ayam.'],
    },
    {
      id: 'R1-3',
      type: 'mcq',
      level: 1,
      prompt: 'Apa yang dimaksud dengan relasi?',
      options: [
        'Aturan yang memasangkan anggota himpunan A dengan anggota himpunan B',
        'Kumpulan benda yang anggotanya jelas',
        'Banyaknya anggota suatu himpunan',
      ],
      answer: 0,
      optionFeedback: { 1: 'Itu pengertian himpunan, bukan relasi.' },
      hints: ['Relasi selalu melibatkan dua himpunan.', 'Ingat kata "memasangkan".'],
      explanation: ['Relasi memasangkan anggota himpunan A dengan anggota himpunan B.'],
    },
    {
      id: 'R1-4',
      type: 'arrow',
      level: 1,
      prompt: 'Ani suka Matematika, Budi suka IPA, Candra suka Seni Budaya. Buat diagram panahnya.',
      relation: FAVORITE_SUBJECT,
      hints: ['Ada tiga siswa, jadi ada tiga panah.', 'Mulai dari Ani ke Matematika.'],
      explanation: ['Ani → Matematika.', 'Budi → IPA.', 'Candra → Seni Budaya.'],
    },
  ],
  summary: [
    'Relasi = aturan yang memasangkan anggota himpunan A dengan anggota himpunan B.',
    'A = himpunan asal, B = himpunan tujuan (kawan).',
    'Panah selalu dari A ke B.',
  ],
};
