import {ServiceLocatorFunction} from '/imports/service-registry/locator'
import {IPermissionRepository} from '/imports/repository/permission/permission'
import {IRoleRepository} from '/imports/repository/role/role'
import {IMemberRepository} from '/imports/repository/member/member'
import {MemberDocument} from '/imports/domain/entities/member/member'
import {PermissionDocument} from '/imports/domain/entities/permission/permission'
import { UserDocument } from '../../entities/user/user'
import { IUserRepository } from '/imports/repository/user/user'
import { Meteor } from 'meteor/meteor'

export type ICheckPermissionsService = {
  memberHasPermission(memberId: string | null, name: string): boolean
  validateMemberPermission(memberId: string | undefined, name: string): void
  userHasPermission(userId: string | null, name: string): boolean
  validateMemberPermission(memberId: string | null, name: string): void
  validateUserPermission(userId: string | null, name: string): void
}

type Dependencies = {
  memberRepo: IMemberRepository
  permissionsRepo: IPermissionRepository
  rolesRepo: IRoleRepository
  userRepository: IUserRepository
}
export function createCheckPermissionsService(
  {
    memberRepo,
    permissionsRepo,
    rolesRepo,
    userRepository,
  }: Dependencies
): ICheckPermissionsService {

  const checkPermissionService: ICheckPermissionsService =  {
    memberHasPermission: (memberId, name) => {
      if(!memberId) {
        return false;
      }

      const permission = permissionsRepo.getPermissionByName(name);
      const { roleIds } = memberRepo.get(memberId);
      if(!roleIds) {
        return false;
      }

      return rolesRepo.validateRolesContainPermission(roleIds, permission._id);
    },

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

    validateMemberPermission: (memberId, name) => {
      if(!memberId) {
        throw new MemberPermissionError({ name: 'anonymous' } as MemberDocument, permissionsRepo.getPermissionByName(name));
      }

      if(!checkPermissionService.memberHasPermission(memberId, name)) {
        throw new MemberPermissionError(memberRepo.get(memberId!), permissionsRepo.getPermissionByName(name));
      }
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

export class MemberPermissionError extends Error {
  constructor(
    public readonly member: MemberDocument,
    public readonly permission: PermissionDocument,
  ) {
    super(`Member '${member.name}' does not have permission '${permission.name}'`);
  }
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
    memberRepo: locate<IMemberRepository>("repository/member/member"),
    permissionsRepo: locate<IPermissionRepository>("repository/permission/permission"),
    rolesRepo: locate<IRoleRepository>("repository/role/role"),
    userRepository: locate<IUserRepository>("repository/user/user"),
  });
}
