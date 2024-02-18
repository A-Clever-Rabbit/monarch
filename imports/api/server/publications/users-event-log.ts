import {subscriptionBuilder} from '/imports/api/lib/subscription-builder'
import {registerPublications} from '/imports/api/lib/register-publications'

import {ActivityLogCollection} from '/imports/infrastructure/db/activity-log/activity-log'

const userEventsPublications = {
  userEvents: subscriptionBuilder({
    run() {
      return [
        ActivityLogCollection.find()
      ];
    }
  })
} as const

export type UserEventsPublications = typeof userEventsPublications

registerPublications(userEventsPublications)
