import { TwitterResolverContext } from '../resolvers';
import { QueryResolvers } from '../resolvers-types.generated';
import { tweetTransform } from '../transforms';

const queryTwitterResolver: QueryResolvers<TwitterResolverContext> = {
  currentUser: (_, __, { db }) => {
    const [firstUser] = db.getAllUsers();
    if (!firstUser)
      throw new Error(
        'currentUser was requested, but there are no users in the database'
      );
    return firstUser;
  },
  suggestions: (_, __, { db: db }) => {
    return db.getAllSuggestions();
  },
  tweets: (
    _parent,
    _args,
    { db, dbTweetToFavoriteCountMap, dbUserCache, dbTweetCache }
  ) => {
    // Get all the users and put them into a cache in memory to avoid multiple calls to the database. It's cheaper to do a single call to the database and store the results in memory than to do multiple calls to the database.
    db.getAllUsers().forEach((user) => {
      dbUserCache[user.id] = user;
    });
    db.getAllFavorites().forEach((favorite) => {
      // Get the current count or initialize it to 0
      const count = dbTweetToFavoriteCountMap[favorite.tweetId] || 0;
      // Update the count in the map
      dbTweetToFavoriteCountMap[favorite.tweetId] = count + 1;
    });
    // Get all the tweets, cache them in memory, transform them and return them
    return db.getAllTweets().map((t) => {
      dbTweetCache[t.id] = t;
      return tweetTransform(t);
    });
  },
};

export default queryTwitterResolver;
