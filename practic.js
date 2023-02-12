const mongoose = require('mongoose');

// Connect to the MongoDB database
mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://vivek:7yaqS3KI5iTcYJzZ@cluster0.jrtk4.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true }).then((result) => {
    console.log('Connected to MongoDB');
  })

// Define a schema for the collection
const accountSchema = new mongoose.Schema({
  name: String,
  balance: {
    type: Number,
    unique: true,
  }
});

const Account = mongoose.model('Account', accountSchema);
async function transfer(from, to, amount) {
  // Start a session
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Decrement the balance of the account with id "from"
    await Account.findOneAndUpdate({ _id: from }, { $inc: { balance: -amount } }, { session });

    // Increment the balance of the account with id "to"
    await Account.findOneAndUpdate({ _id: to }, { $inc: { balance: amount } }, { session });
    // throw new Error('Something went wrong');
    await session.commitTransaction();
    console.log('Transaction completed');
  } catch (error) {
    await session.abortTransaction();
    console.log('Transaction aborted');
  } finally {
    session.endSession();
  }
}

transfer("63e8bbb1a97ff86824a64065", "63e8bbb1a97ff86824a64064", 200);