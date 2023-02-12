import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/postgresql";
import path from "path";
require('dotenv').config()

export default {
    dbName: 'creddit-db',
    type: 'postgresql',
    user: process.env.USER,
    password: process.env.PASSWORD,
    allowGlobalContext: true,
    debug: process.env.NODE_ENV !== 'production',
    entities: [Post],
    migrations: {
        path: path.join(__dirname, './migrations'), // path to the folder with migrations
        pattern: /^[\w-]+\d+\.[tj]s$/
    }
} as Parameters<typeof MikroORM.init>[0];