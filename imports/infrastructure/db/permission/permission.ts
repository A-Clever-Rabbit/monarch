import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'
import {PermissionDocument} from '/imports/domain/entities/permission/permission'

export const PermissionCollection = new Mongo.Collection<PermissionDocument>('permission');

if (Meteor.isServer) {
  PermissionCollection.createIndex({ name: 1 }, { unique: true });
}
