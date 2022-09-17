const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = connectDB;
/* Might need these keys below for default.json
{
  "mongoURI":"mongodb+srv://jacob:jacob@johncage-wykta.mongodb.net/test?retryWrites=true&w=majority",
  "jwtSecret":"Cawaw%T<c6.)(tyr}XSz)SefG(7]#4)~"
} 
{
    "mongoURI": "mongodb+srv://yoan:iching433@johncage-wykta.mongodb.net/test?retryWrites=true&w=majority",
    "jwtSecret": "secretofcage"
}
*/
