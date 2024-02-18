import {Subscription} from 'meteor/meteor'
import {z, ZodType} from 'zod'
import {ValidationError} from '/imports/api/lib/validation-error'


type SubscriptionBuilderInput<TSchema extends ZodType, TReturn> = {
  input?: TSchema
  run:
    TSchema extends undefined
      ? (this: Subscription) => TReturn
      : (this: Subscription, input: z.infer<TSchema>) => TReturn
}

export function subscriptionBuilder<
  TSchema extends ZodType,
  TReturn
>({ input, run }: SubscriptionBuilderInput<TSchema, TReturn>) {
  return function(this: Subscription, rawInput: z.infer<TSchema>): TReturn {

    if(!input) {
      return (run as (this: Subscription) => TReturn).call(this);
    }

    const result = input.safeParse(rawInput);

    if(!result.success) {
      throw new ValidationError(result.error);
    }

    return run.call(this, result.data);
  }
}
