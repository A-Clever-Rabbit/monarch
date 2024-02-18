import {Mongo} from 'meteor/mongo'
import {ClientActionDocument} from '/imports/domain/entities/client-action/client-action'

export const ClientActionCollection =
  new Mongo.Collection<ClientActionDocument>('clientActions');
