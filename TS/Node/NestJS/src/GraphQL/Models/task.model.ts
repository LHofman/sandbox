import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Task {
  @Field(type => Int)
  id: number;

  @Field()
  description: string;

  // @Field(type => String, { nullable: true, description: 'This is a list', deprecationReason: 'Removed in new versions' })
  // optionalField?: string;
}
