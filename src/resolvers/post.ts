import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types";

@Resolver()
export class PostResolver {
    // Query is for getting data
    // Mutation is for updating, inserting, deleting, changing things on the server
    @Query(() => [Post])
    posts(@Ctx() { em }: MyContext): Promise<Post[]> {
        return em.find(Post, {});
    }

    @Query(() => Post, { nullable: true }) // graphql type
    post(
        @Arg('id', () => Int) id: number, // id reflects the schema on the graphql localhost:4000/graphql
        @Ctx() { em }: MyContext
    ): Promise<Post | null> { // typescript type
        return em.findOne(Post, { id });
    }

    @Mutation(() => Post) // graphql type
    async createPost(
        @Arg('id', () => Int) id: number,
        @Arg('title', () => String) title: string, // title reflects the schema on the graphql localhost:4000/graphql
        @Ctx() { em }: MyContext
    ): Promise<Post> { // typescript type
        const post = em.create(Post, { id, title });
        await em.persistAndFlush(post);

        return post;
    }

    @Mutation(() => Post, { nullable: true }) // graphql type
    async updatePost(
        @Arg('id', () => Int) id: number,
        @Arg('title', () => String, { nullable: true }) title: string, // title reflects the schema on the graphql localhost:4000/graphql
        @Ctx() { em }: MyContext
    ): Promise<Post | null> { // typescript type
        const post = await em.findOne(Post, { id }); // fetch post from db

        if (!post) {
            return null;
        }

        if (typeof title !== 'undefined') { // update post title if exist
            post.title = title;
            await em.persistAndFlush(post);
        }
        
        return post;
    }
}