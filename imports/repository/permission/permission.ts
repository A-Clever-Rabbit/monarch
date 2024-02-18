import {Mongo} from 'meteor/mongo'
import {PermissionDocument} from '/imports/domain/entities/permission/permission'
import {PermissionCollection} from '/imports/infrastructure/db/permission/permission'
import {createBaseRepositoryService, IRepository} from '/imports/repository/base-repository-service'
import {ServiceLocatorFunction} from '/imports/service-registry/locator'
import {IDateProvider} from '/imports/infrastructure/services/date/default-provider'
import {RoleType} from '/imports/domain/entities/role/role'

export type IPermissionRepository = IRepository<PermissionDocument> & {
  search(roleType: RoleType, search?: string): Mongo.Cursor<PermissionDocument, PermissionDocument>
  getPermissionByName(name: string): PermissionDocument
}

export function createPermissionRepository(dateProvider?: IDateProvider): IPermissionRepository {
  const service = createBaseRepositoryService(PermissionCollection, dateProvider);
  return {
    ...service,
    search: (roleType, search) => {
      const query: Mongo.Selector<PermissionDocument> = { roleType };

      if(search) {
        query.name = { $regex: search, $options: 'i' };
      }

      return service.collection()
        .find(query)
    },

    getPermissionByName: (name) => {
      const permission = service.collection().findOne({ name });
      if(!permission) {
        throw new Error(`Permission '${name}' does not exist, please contact the system administrator.`);
      }
      return permission;
    },
  }
}

export function registerPermissionRepository(locate: ServiceLocatorFunction) {
  return createPermissionRepository(
    locate<IDateProvider>("infrastructure/date/default-provider")
  );
}