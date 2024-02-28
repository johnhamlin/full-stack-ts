import { Tweet } from './resolvers-types.generated';
import { DbTweet } from './db';

// Omit author because it's a related record that will need its own transform
export const tweetTransform = (t: DbTweet): Omit<Tweet, 'author'> => {
  return {
    id: t.id,
    body: t.message,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
};
