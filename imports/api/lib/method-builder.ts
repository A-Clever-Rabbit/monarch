import {Meteor} from 'meteor/meteor'
import {z, ZodType} from 'zod'
import {ValidationError} from '/imports/api/lib/validation-error'
import {MemberPermissionError} from '/imports/domain/services/permissions/check-permissions'
import {FieldError} from '/imports/domain/field-error'
import {ZodError} from 'zod'

type MethodFactoryInput<TSchema extends ZodType, TReturn> = {
  input?: TSchema
  run:
    TSchema extends undefined
      ? (this: Meteor.MethodThisType) => TReturn
      : (this: Meteor.MethodThisType, input: z.infer<TSchema>) => TReturn
}

export function methodBuilder<
  TSchema extends ZodType,
  TReturn
>({ input, run }: MethodFactoryInput<TSchema, TReturn>) {
  return async function(this: Meteor.MethodThisType, rawInput: z.infer<TSchema>): Promise<TReturn> {
    try {
      if(!input) {
        return (run as (this: Meteor.MethodThisType) => TReturn).call(this);
      }

      const result = input.parse(rawInput);

      return await run.call(this, result);
    } catch (error) {

      if(error instanceof ZodError) {
        throw new ValidationError(error);
      }

      if(error instanceof MemberPermissionError) {
        throw new Meteor.Error("member-not-authorized", error.message)
      }

      if(error instanceof FieldError) {
        throw new Meteor.Error("field-error", error.message, error.fieldName)
      }

      if(error instanceof Error) {
        throw new Meteor.Error(error.name, error.message);
      }

      throw error;
    }
  }
}
