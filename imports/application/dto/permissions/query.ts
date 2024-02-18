import {Mongo} from 'meteor/mongo'
import {PermissionDocument} from '/imports/domain/entities/permission/permission'

export type PermissionDTO = Omit<PermissionDocument, '_id'> & { _id: string }

export const PermissionDTOCollection = new Mongo.Collection<PermissionDTO>('permissions');

export function findPermissions() {
  return PermissionDTOCollection.find();
}
