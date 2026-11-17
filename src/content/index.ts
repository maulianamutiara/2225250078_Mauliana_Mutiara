import { topic0 } from './topic0';
import { topic1 } from './topic1';
import { topic2 } from './topic2';
import { topic3 } from './topic3';
import { topic4 } from './topic4';
import { topic5 } from './topic5';
import { topic6 } from './topic6';
import { topic7 } from './topic7';
import type { ExplainStage, Problem, TopicContent } from './types';

export const topicContents: TopicContent[] = [topic0, topic1, topic2, topic3, topic4, topic5, topic6, topic7];

export function findTopicContent(id: number): TopicContent | undefined {
  return topicContents.find((t) => t.topicId === id);
}

function isProblem(item: Problem | ExplainStage): item is Problem {
  return item.type !== 'explain';
}

/** Semua soal yang dinilai otomatis: soal latihan biasa + tahap soal literasi (kecuali tahap "jelaskan"). */
export const allProblems: Problem[] = topicContents.flatMap((t) => [
  ...t.problems,
  ...(t.literacy ?? []).flatMap((task) => task.stages.map((s) => s.item).filter(isProblem)),
]);
