import {Meteor} from "meteor/meteor";
import {methodBuilder} from "/imports/api/lib/method-builder";
import {z} from "zod";

import {ClientActionCollection} from '/imports/infrastructure/db/client-action/client-action'

const methods = {
  'client-action.remove': methodBuilder({
    input: z.object({
      actionId: z.string()
    }),
    run({ actionId }) {
      return ClientActionCollection.remove({ _id: actionId })
    }}),
} as const;

export type ClientActionsMethods = typeof methods;

Meteor.methods(methods)
