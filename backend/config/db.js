import { Sequelize } from "sequelize";
 
const db1 = new Sequelize('jctdatabase', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});
 
// this instance of the db is being used for register/login
export default db1;

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
