import {Subscription} from 'meteor/meteor'
import {ServiceLocatorFunction} from '/imports/service-registry/locator'
import {IPermissionRepository} from '/imports/repository/permission/permission'
import {reflect} from '/imports/api/lib/reflect-relational-publication'
import {PermissionDTOCollection} from '/imports/application/dto/permissions/query'

export type IPermissionsPublication = (this: Subscription, args: Args) => void

type Args = {
  search?: string
}

type Dependencies = {
  permissionRepo: IPermissionRepository
}

export function permissionsPublication(deps: Dependencies): IPermissionsPublication {
  return function({ search }) {
    reflect({
      cursor: deps.permissionRepo.search(search),
      collection: PermissionDTOCollection,
      subscription: this,
    });
  }
}

export function registerPermissionsPublication(locate: ServiceLocatorFunction) {
  return permissionsPublication({
    permissionRepo: locate<IPermissionRepository>("repository/permission/permission")
  });
}
