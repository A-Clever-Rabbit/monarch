import {createBaseRepositoryService, IRepository} from '/imports/repository/base-repository-service'
import {UserDocument} from '/imports/domain/entities/user/user'
import {UserCollection} from '/imports/infrastructure/db/user/user'
import {IDateProvider} from '/imports/infrastructure/services/date/default-provider'
import {ServiceLocatorFunction} from '/imports/service-registry/locator'

export type IUserRepository = IRepository<UserDocument>

export function createUserRepository(dateProvider?: IDateProvider): IUserRepository {
  const service = createBaseRepositoryService(UserCollection, dateProvider)
  return {
    ...service
  }
}

export function registerUserRepository(locate: ServiceLocatorFunction) {
  return createUserRepository(locate<IDateProvider>("infrastructure/date/default-provider"))
}
