import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'
import {UserDocument} from '/imports/domain/entities/user/user'

declare module "meteor/meteor" {
  module Meteor {
    interface User extends UserDocument {}
  }
}

export const UserCollection: Mongo.Collection<UserDocument> = Meteor.users as Mongo.Collection<UserDocument>;
