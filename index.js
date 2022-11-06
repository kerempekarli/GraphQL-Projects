const { ApolloServer, gql } = require("apollo-server");
const { uuid } = require("uuidv4");

const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

const users = [
  { id: 1, username: "Kerem" },
  { id: 2, username: "Ekrem" },
];
const participants = [
  { id: 1, username: "Kerem123" },
  { id: 2, username: "Ekrem123" },
];

const locations = [
  { id: 1, username: "Istanbul" },
  { id: 2, username: "Ankara" },
];
const events = [
  {
    id: 1,
    title: "title123",
    user_id: 1,
    participant_id: 1,
    location_id: 1,
  },
  {
    id: 2,
    title: "title223",
    user_id: 2,
    participant_id: 2,
    location_id: 2,
  },
];

const typeDefs = gql`
  type User {
    id: ID
    username: String
  }
  type Participant {
    id: ID
    username: String
  }
  type Location {
    id: ID
    name: String
  }
  type Event {
    id: ID
    title: String
    user_id: ID
    user: User
    location: Location
    participant: Participant
    pariticipant_id: ID
    location_id: ID
  }
  type Query {
    users: [User]
    user(id: ID): User
    event(id: ID!): Event
    events: [Event]
  }
  type Mutation {
    createUser(username: String!): User!
    
  }
`;
const resolvers = {
  Mutation: {
    createUser: (parent, args) => {
      const user = { id: uuid(), username: args.username };
      users.push(user);
      console.log(users);
      return user;
    },
  },
  Query: {
    users: () => users,
    user: (parent, args) => {
      console.log(args);
      const data = users.find((user) => user.id == args.id);
      console.log("data", data);
      return data;
    },
    events: () => events,
    event: (parent, args) => {
      const data = events.find((event) => event.id == args.id);
      return data;
    },
  },
  Event: {
    user: (parent, args) => {
      return users.find((user) => user.id == parent.user_id);
    },
    participant: (parent, args) => {
      return participants.find(
        (participant) => participant.id == parent.participant_id
      );
    },
    location: (parent, args) => {
      return locations.find((location) => location.id == parent.location_id);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
});
server.listen().then(({ url }) => console.log("GraphQL Server Is Up at", url));
