import {Meteor, Subscription} from 'meteor/meteor'

type PublicationDefinitions = {
  [key: string]: (this: Subscription, ...args: any[]) => any
}
export function registerPublications(subscriptions: PublicationDefinitions) {
  Object.entries(subscriptions).forEach(([name, run]) => {
    Meteor.publish(name, run);
  });
}
