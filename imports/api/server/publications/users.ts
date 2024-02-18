import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'
import {subscriptionBuilder} from '/imports/api/lib/subscription-builder'
import {registerPublications} from '/imports/api/lib/register-publications'
import {z} from 'zod'

import {ClientActionCollection} from '/imports/infrastructure/db/client-action/client-action'
import {UserCollection} from '/imports/infrastructure/db/user/user'

const userPublications = {
  clientInstructions: subscriptionBuilder({
    run() {
      if(this.userId) {
        return ClientActionCollection.find({ userId: this.userId })
      }

      this.ready();
    }
  }),

  users: subscriptionBuilder({
    input: z.object({
      search: z.string().optional()
    }),
    run({ search }) {
      const query: Mongo.Selector<Meteor.User> = {}

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { "emails.address": { $regex: search, $options: "i" } }
        ]
      }

      return [
        UserCollection.find(query)
      ];
    }
  }),
} as const

export type UsersPublications = typeof userPublications

registerPublications(userPublications)
