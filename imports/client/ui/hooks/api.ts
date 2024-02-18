import {Meteor} from 'meteor/meteor'
import {useMutation, UseMutationOptions, useQuery, UseQueryOptions} from 'react-query'
import type {AppMethods, AppPublications} from '/imports/api/types'
import {useSubscribe as useSubscribe_meteor} from 'meteor/react-meteor-data'
import {ValidationError} from "/imports/api/lib/validation-error";

type FuncDefinitions = { [key: string]: (...args: any[]) => any }
type FuncInput<TName extends keyof TDefs, TDefs extends FuncDefinitions> = Parameters<TDefs[TName]>[0]
type FuncReturnType<MethodName extends keyof MethodDefs, MethodDefs extends FuncDefinitions> = Awaited<ReturnType<MethodDefs[MethodName]>>

type MethodError = Meteor.Error | ValidationError

/**
 * A react-query hook for calling typesafe Meteor methods
 * @param methodName
 * @param methodInput
 * @param options
 *
 * TODO: Excess property checks only apply when we use the MethodInput<TMethodName, AppMethods> directly in the function signature and
 *  not if we assign it to a type variable in the useMethodQuery generics first. Why?
 */
export const useMethodQuery = <TMethodName extends keyof AppMethods, Output = FuncReturnType<TMethodName, AppMethods>>
(methodName: TMethodName, methodInput?: FuncInput<TMethodName, AppMethods>, options?: Omit<UseQueryOptions<Output, MethodError>, 'queryKey' | 'queryFn'>) =>
  useQuery<Output, MethodError>({
    ...options,
    queryKey: [methodName, methodInput],
    queryFn: () =>
      new Promise<Output>((resolve, reject) => Meteor.call(methodName, methodInput, (err: MethodError, result: Output) => {
        if(err) {
          reject(err);
        } else {
          resolve(result);
        }
      }))
  })

/**
 * A react-query hook for calling typesafe Meteor methods as mutations (imperative)
 * @param methodName
 * @param options
 */
export const useMethodMutation = <TMethodName extends keyof AppMethods, Output = FuncReturnType<TMethodName, AppMethods>>
(methodName: TMethodName, options?: Omit<UseMutationOptions<Output, MethodError, FuncInput<TMethodName, AppMethods>>, 'mutationKey' | 'mutationFn'>) =>
  useMutation({
    ...options,
    mutationKey: [methodName],
    mutationFn: (methodInput) =>
      new Promise<Output>((resolve, reject) => Meteor.call(methodName, methodInput, (err: MethodError, result: Output) => {
        if(err) {
          reject(err);
        } else {
          resolve(result);
        }
      }))
  })


// TODO: See above TODO, then improve type checking here. In usages the args are not required when they should be.
//  Test a subscription with and without args.
export const useSubscribe = <TSubscriptionName extends keyof AppPublications, TInput = FuncInput<TSubscriptionName, AppPublications>>
(subscriptionName: TSubscriptionName, ...input: TInput extends undefined ? []:[input: TInput]) =>
  useSubscribe_meteor(subscriptionName, ...input)
