const connection = require('../config/connection');
const { User, Thought } = require('../models');

// Define users with real names
const seedUsers = [
  {
    username: 'JohnDoe',
    email: 'john.doe@example.com',
  },
  {
    username: 'JaneSmith',
    email: 'jane.smith@example.com',
  },
  {
    username: 'AliceJohnson',
    email: 'alice.johnson@example.com',
  },
  {
    username: 'BobBrown',
    email: 'bob.brown@example.com',
  },
];

// Define thoughts associated with users
const seedThoughts = [
  {
    thoughtText: 'This is John’s first thought!',
    username: 'JohnDoe',
  },
  {
    thoughtText: 'Jane is thinking about something cool.',
    username: 'JaneSmith',
  },
  {
    thoughtText: 'Alice is loving this API!',
    username: 'AliceJohnson',
  },
  {
    thoughtText: 'Bob has some thoughts on the matter.',
    username: 'BobBrown',
  },
];

// Function to seed friends relationships
const seedFriends = async (users) => {
  for (let user of users) {
    const friendsToAdd = users
      .filter(u => u._id.toString() !== user._id.toString()) // Prevent adding oneself as a friend
      .slice(0, 2); // Pick 2 friends randomly

    for (let friend of friendsToAdd) {
      await User.findByIdAndUpdate(user._id, { $addToSet: { friends: friend._id } });
    }
  }
};

// Function to seed reactions to thoughts
const seedReactions = async (thoughts, users) => {
  for (let thought of thoughts) {
    const reactions = [
      {
        reactionBody: 'Nice thought, John!',
        username: 'JaneSmith',
      },
      {
        reactionBody: 'I completely agree with you, Alice!',
        username: 'BobBrown',
      }
    ];

    for (let reaction of reactions) {
      await Thought.findByIdAndUpdate(thought._id, { $addToSet: { reactions: reaction } });
    }
  }
};

// Main function to seed the database
const seedDatabase = async () => {
  try {
    await connection;
    console.log('Connected to the database.');

    // Clear existing data
    await User.deleteMany({});
    await Thought.deleteMany({});
    console.log('Cleared the existing users and thoughts.');

    // Seed users
    const users = await User.insertMany(seedUsers);
    console.log('Users seeded:', users);

    const thoughts = [];
    // Seed thoughts and associate them with users
    for (const thoughtData of seedThoughts) {
      const user = users.find((user) => user.username === thoughtData.username);
      if (user) {
        const thought = await Thought.create({
          ...thoughtData,
          userId: user._id,
        });
        await User.findByIdAndUpdate(user._id, { $push: { thoughts: thought._id } });
        thoughts.push(thought);
        console.log(`Thought for user ${user.username} seeded:`, thought);
      }
    }

    // Seed friends
    await seedFriends(users);
    console.log('Friends seeded successfully!');

    // Seed reactions
    await seedReactions(thoughts, users);
    console.log('Reactions seeded successfully!');

    console.log('All data seeded successfully!');
  } catch (err) {
    console.error('Error seeding the database:', err);
  } finally {
    try {
      await connection.close();
      console.log('Database connection closed.');
    } catch (err) {
      console.error('Error closing the database connection:', err);
    }
    process.exit(0);
  }
};

seedDatabase();
