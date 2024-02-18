import {Mongo} from 'meteor/mongo'
import {RoleDocument} from '/imports/domain/entities/role/role'

export const RoleCollection = new Mongo.Collection<RoleDocument>('role');
