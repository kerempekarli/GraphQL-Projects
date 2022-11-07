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
  { id: 1, name: "Kerem123" },
  { id: 2, name: "Ekrem123" },
];

const locations = [
  { id: 1, name: "Istanbul" },
  { id: 2, name: "Ankara" },
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
  input createUserInput {
    username: String!
  }
  input updateUserInput {
    username: String!
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
    createUser(data: createUserInput!): User!
    updateUser(id: ID!, data: updateUserInput!): User!
    deleteUser(id: ID!): User!
    createEvent(
      title: String
      user_id: ID
      participant_id: ID
      location_id: ID
    ): Event
  }
`;
const resolvers = {
  Mutation: {
    createUser: (parent, { data }) => {
      console.log(data);
      const user = { id: uuid(), ...data };
      users.push(user);
      console.log(users);
      return user;
    },
    updateUser: (parent, { id, data }) => {
      const user_index = users.findIndex((user) => user.id == id);
      const updatedUser = (users[user_index] = {
        ...users[user_index],
        ...data,
      });
      return updatedUser;
    },
    deleteUser: (parent, { id }) => {
      const index = users.findIndex((user) => user.id == id);
      if (index == -1) {
        throw new Error("User not found");
      }
      const deletedUser = users[index];
      users.splice(index, 1);

      return deletedUser;
    },
    createEvent: (parent, args) => {
      const event = {
        id: uuid(),
        title: args.title,
        user_id: args.user_id,
        participant_id: args.participant_id,
        location_id: args.location_id,
      };
      console.log(event);
      events.push(event);
      return event;
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
