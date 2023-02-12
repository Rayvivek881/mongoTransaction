const { MongoClient, ObjectId } = require("mongodb");

async function runTransaction(from, to, amount) {
  // Connect to the database
  const client = await MongoClient.connect("mongodb+srv://vivek:7yaqS3KI5iTcYJzZ@cluster0.jrtk4.mongodb.net/?retryWrites=true&w=majority");
  const db = client.db("test");
  console.log((await db.collections()).map(c => c.collectionName));
  // Start a transaction
  const session = client.startSession();
  session.startTransaction();

  try {
    await db.collection('accounts').updateOne({ _id: new ObjectId(from) }, { $inc: { balance: -amount } }, { session });
    await db.collection('accounts').updateOne({ _id: new ObjectId(to) }, { $inc: { balance: amount } }, { session });
    
    await session.commitTransaction();
    console.log("Transaction committed successfully");
  } catch (error) {
    // If an error occurs, rollback the transaction
    await session.abortTransaction();
    console.error("Transaction rolled back due to error: ", error);
  } finally {
    // End the session
    session.endSession();

    // Close the connection
    client.close();
  }
}
runTransaction("63e8bbb1a97ff86824a64065", "63e8bbb1a97ff86824a64064", 200);
