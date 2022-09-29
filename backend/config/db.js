import { Sequelize } from "sequelize";
 
const db = new Sequelize('jctdatabase', 'root', 'mypassword112', {
    host: "localhost",
    dialect: "mysql"
});
 
export default db;

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
