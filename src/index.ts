import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import { PostResolver } from "./resolvers/post";

const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig); // connect to database
    await orm.getMigrator().up(); // run migrations

    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver, PostResolver],
            validate: false
        }),
        context: () => ({ em: orm.em }) // graphql needs to have access to orm to make queries to db
    });

    await apolloServer.start(); // starting the apollo server
    apolloServer.applyMiddleware({ app }); // applying the /graphql endpoint

    app.listen(4000, () => { // starting the express server
        console.log('Server started on port 4000');
    });
};

main().catch(error => {
    console.log(error);
});
