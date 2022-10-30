import { Sequelize } from "sequelize";
import db from "../config/db.js";
 
const { DataTypes } = Sequelize;
 
const Users = db.define('users',{
    username:{
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING
    },
    password:{
        type: DataTypes.STRING
    },
    bio:{
        type: DataTypes.STRING
    },
    isMaestro:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    isRequested:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    refresh_token:{
        type: DataTypes.TEXT
    }
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
 
export default Users;
