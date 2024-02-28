import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer, ExpressContext, gql } from 'apollo-server-express';
import * as express from 'express';
import { Server } from 'http';
import Db from './db';
export async function createApolloServer(
  db: Db,
  httpServer: Server,
  app: express.Application
): Promise<ApolloServer<ExpressContext>> {
  const typeDefs = gql`
    type Query {
      currentUser: User!
      suggestions: [Suggestion!]!
    }
    type User {
      id: String!
      name: String!
      handle: String!
      coverUrl: String!
      avatarUrl: String!
      createdAt: String!
      updatedAt: String!
    }
    type Suggestion {
      name: String!
      handle: String!
      avatarUrl: String!
      reason: String!
    }
  `;
  const resolvers = {
    Query: {
      currentUser: () => {
        return {
          id: '123',
          name: 'John Doe',
          handle: 'johndoe',
          coverUrl: '',
          avatarUrl: '',
          createdAt: '',
          updatedAt: '',
        };
      },
      suggestions: () => {
        return [];
      },
    },
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // If you pass an object instead of a function, the object persists across multiple requests.
    context: () => ({ db }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({ app });
  return server;
}
