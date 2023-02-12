import { Resolver, Query, Ctx, Arg, Mutation, InputType, Field, Int, ObjectType } from "type-graphql";
import { User } from "../entities/User";
import { MyContext } from "../types";
import argon2 from "argon2";

@InputType()
class CredentialsInput {
    @Field(() => String)
    username!: string;
    
    @Field(() => String)
    password!: string;
}

@ObjectType()
class FieldError {
    @Field(() => String)
    field!: string;

    @Field(() => String)
    message!: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver()
export class UserResolver {
    @Mutation(() => User, { nullable: true })
    async register(
        @Arg('id', () => Int) id: number,
        @Arg('options', () => CredentialsInput) options: CredentialsInput,
        @Ctx() { em }: MyContext
    ) {
        const hashedPassword = await argon2.hash(options.password);
        const user = em.create(User, {
            id: id,
            username: options.username,
            password: hashedPassword
        });

        try {
            await em.persistAndFlush(user);
        } catch (error) {
            console.log(error);
            return;
        }

        return user;
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options', () => CredentialsInput) options: CredentialsInput,
        @Ctx() { em }: MyContext
    ): Promise<UserResponse> {
        const username = options.username.toLowerCase();
        const user = await em.findOne(User, { username: username });

        if (!user) {
            return {
                errors: [{
                    field: 'username',
                    message: "that username doesn't exist"
                }]
            }
        }

        const valid = await argon2.verify(user.password, options.password);

        if (!valid) {
            return {
                errors: [{
                    field: 'password',
                    message: 'incorrect password'
                }]
            }
        }

        return { user };
    }
}