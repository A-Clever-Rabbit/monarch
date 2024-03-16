import {ServiceLocatorFunction} from '/imports/service-registry/locator'
import {IPermissionRepository} from '/imports/repository/permission/permission'
import {IRoleRepository} from '/imports/repository/role/role'
import {PermissionDocument} from '/imports/domain/entities/permission/permission'
import { UserDocument } from '../../entities/user/user'
import { IUserRepository } from '/imports/repository/user/user'
import { Meteor } from 'meteor/meteor'

export type ICheckPermissionsService = {
  userHasPermission(userId: string | null, name: string): boolean
  validateUserPermission(userId: string | null, name: string): void
}

type Dependencies = {
  permissionsRepo: IPermissionRepository
  rolesRepo: IRoleRepository
  userRepository: IUserRepository
}
export function createCheckPermissionsService(
  {
    permissionsRepo,
    rolesRepo,
    userRepository,
  }: Dependencies
): ICheckPermissionsService {

  const checkPermissionService: ICheckPermissionsService =  {
    userHasPermission: (userId, name) => {
      if(!userId) {
        return false;
      }

      const permission = permissionsRepo.getPermissionByName(name);
      const user = userRepository.get(userId);
      if(!user) {
        return false;
      }

      if(!permission) {
        return false;
      }

      if(user.roleIds.length === 0){
        return false;
      }

      return rolesRepo.validateRolesContainPermission(user.roleIds, permission._id);
    },

    validateUserPermission: (userId, name) => {
      // TODO check this for unauthorized calls.
      if(!userId) {
        throw new Meteor.Error(`User is not logged in.`);
      }

      const user = userRepository.get(userId);
      if(!user) {
        throw new Meteor.Error(`UserId '${userId}' does not exist.`);
      }

      const permission = permissionsRepo.getPermissionByName(name);
      if(!permission) {
        throw new Meteor.Error(`Permission '${name}' does not exist.`);
      }

      if(user.roleIds.length === 0){
        throw new UserPermissionError(user, permission);
      }

      if(!rolesRepo.validateRolesContainPermission(user.roleIds, permission._id)){
        throw new UserPermissionError(user, permission);
      }
    },
  }

  return checkPermissionService;
}

export class UserPermissionError extends Error {
  constructor(
    public readonly user: UserDocument,
    public readonly permission: PermissionDocument,
  ) {
    super(`User '${user.name}' does not have permission '${permission.name}'`);
  }
}

export function registerCheckPermissionsService(locate: ServiceLocatorFunction) {
  return createCheckPermissionsService({
    permissionsRepo: locate<IPermissionRepository>("repository/permission/permission"),
    rolesRepo: locate<IRoleRepository>("repository/role/role"),
    userRepository: locate<IUserRepository>("repository/user/user"),
  });
}
