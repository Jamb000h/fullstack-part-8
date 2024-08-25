import { Book } from "./models/Book.js";
import { Author } from "./models/Author.js";
import { User } from "./models/User.js";
import { PubSub } from "graphql-subscriptions";
const pubsub = new PubSub();

export const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      // Construct the query filters
      const queryFilters = [{}];

      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (!author) {
          return [];
        }

        queryFilters.push({ author: author });
      }

      if (args.genre) {
        queryFilters.push({ genres: args.genre });
      }

      return Book.find({ $and: queryFilters }).populate({ path: "author" });
    },
    allAuthors: async () => {
      // Feels inefficient...
      const authors = await Author.find({});
      for (const author of authors) {
        author.bookCount = await Book.find({ author: author }).countDocuments();
      }
      return authors;
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("wrong credentials", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const existingAuthor = await Author.findOne({ name: args.author });
      if (!existingAuthor) {
        const author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError("Creating an author failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.name,
              error,
            },
          });
        }
      }
      const book = new Book({
        ...args,
        author: await Author.findOne({ name: args.author }),
      });
      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError("Creating a book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: book });

      return book;
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("wrong credentials", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const author = await Author.findOne({ name: args.name });
      if (!author) return null;
      author.born = args.setBornTo;
      try {
        await author.save();
      } catch (error) {
        throw new GraphQLError("Updating an author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }
      return Author.findOne({ name: args.name });
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return {
        token: { value: jwt.sign(userForToken, process.env.JWT_SECRET) },
        favoriteGenre: user.favoriteGenre,
      };
    },
  },
  Subscription: {
    bookAdded: { subscribe: () => pubsub.asyncIterator("BOOK_ADDED") },
  },
};
