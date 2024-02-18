import {SettingDocument} from '/imports/domain/entities/setting/setting'
import {SettingsCollection} from '/imports/infrastructure/db/setting/setting'
import {createBaseRepositoryService, IRepository} from '/imports/repository/base-repository-service'
import {ServiceLocatorFunction} from '/imports/service-registry/locator'
import {IDateProvider} from '/imports/infrastructure/services/date/default-provider'

export type ISettingRepository = IRepository<SettingDocument> & {
  getSettings(): SettingDocument | undefined
}

export function createSettingsRepository(dateProvider?: IDateProvider): ISettingRepository {
  const service = createBaseRepositoryService(SettingsCollection, dateProvider);
  return {
    ...service,
    getSettings() {
      return SettingsCollection.findOne();
    }
  }
}

export function registerSettingsRepository(locate: ServiceLocatorFunction) {
  return createSettingsRepository(
    locate<IDateProvider>("infrastructure/date/default-provider")
  );
}
