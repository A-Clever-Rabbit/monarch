import {ClientActionDocument} from '/imports/domain/entities/client-action/client-action'
import {ClientActionCollection} from '/imports/infrastructure/db/client-action/client-action'
import {createBaseRepositoryService, IRepository} from '/imports/repository/base-repository-service'
import {ServiceLocatorFunction} from '/imports/service-registry/locator'

import {IDateProvider} from '/imports/infrastructure/services/date/default-provider'

export type IClientActionRepository = IRepository<ClientActionDocument>

export function createClientActionRepository(dateProvider?: IDateProvider): IClientActionRepository {
  const service = createBaseRepositoryService(ClientActionCollection, dateProvider)
  return {
    ...service
  }
}

export function registerClientActionRepository(locate: ServiceLocatorFunction) {
  return createClientActionRepository(
    locate<IDateProvider>("infrastructure/date/default-provider")
  );
}
