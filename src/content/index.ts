import { topic0 } from './topic0';
import { topic1 } from './topic1';
import { topic2 } from './topic2';
import { topic3 } from './topic3';
import { topic4 } from './topic4';
import { topic5 } from './topic5';
import { topic6 } from './topic6';
import type { TopicContent } from './types';

export const topicContents: TopicContent[] = [topic0, topic1, topic2, topic3, topic4, topic5, topic6];

export function findTopicContent(id: number): TopicContent | undefined {
  return topicContents.find((t) => t.topicId === id);
}

export const allProblems = topicContents.flatMap((t) => t.problems);
