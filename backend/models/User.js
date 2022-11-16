import { Sequelize } from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const Users = db.define('Users',{
    username:{
        type: DataTypes.STRING,
        unique: true
    },
    email:{
        type: DataTypes.STRING,
        unique: true
    },
    password:{
        type: DataTypes.STRING
    },
    confirmed:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
