import {RoleDocument} from '/imports/domain/entities/role/role'
import {RoleCollection} from '/imports/infrastructure/db/role/role'
import {createBaseRepositoryService, IRepository} from '/imports/repository/base-repository-service'
import {ServiceLocatorFunction} from '/imports/service-registry/locator'

import {IDateProvider} from '/imports/infrastructure/services/date/default-provider'
import { Mongo } from 'meteor/mongo'

export type IRoleRepository = IRepository<RoleDocument> & {
  search: (query: RoleQueryArgs) => Mongo.Cursor<RoleDocument>
  validateRolesContainPermission: (roleIds: string[], permissionId: string) => boolean
}

type RoleQueryArgs = {
  search?: string
  roleIds?: string[]
  limit?: number
}

export function createRoleRepository(dateProvider?: IDateProvider): IRoleRepository {
  const service = createBaseRepositoryService(RoleCollection, dateProvider);
  return {
    ...service,
    search({ search, roleIds, limit }) {
      const querySelector: Mongo.Selector<RoleDocument> = {};

      if(search) {
        querySelector.$or = [
          { name: { $regex: search, $options: 'i' } },
          { safeName: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      }

      if (roleIds?.length) {
        querySelector._id = { $in: roleIds }
      }

      return service.list(querySelector, { limit });
    },

    validateRolesContainPermission(roleIds, permissionId) {
      return service.collection().find({
        _id: { $in: roleIds },
        permissionIds: permissionId
      }).count() > 0;
    }
  }
}

export function registerRoleRepository(locate: ServiceLocatorFunction) {
  return createRoleRepository(
    locate<IDateProvider>("infrastructure/date/default-provider")
  );
}
