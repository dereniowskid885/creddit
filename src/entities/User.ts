import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType() // this helps to convert it also for graphql type, to use it in the post resolver that returns array of posts with type Post
@Entity()
export class User {
  @Field(() => Int) // this also is for graphql, exposing for graphql schema
  @PrimaryKey({ type: 'numeric' })
  id?: number;

  @Field(() => String) // this also is for graphql, exposing for graphql schema
  @Property({ type: 'date' })
  createdAt? = new Date();

  @Field(() => String) // this also is for graphql, exposing for graphql schema
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt? = new Date();

  @Field(() => String) // this also is for graphql, exposing for graphql schema
  @Property({ type: 'text', unique: true })
  username!: string;

  // doesn't have @Field to not to be exported to graphql schema
  @Property({ type: 'text' })
  password!: string;
}