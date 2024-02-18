/**
 * --------------------------------------
 * GENERATED CODE - DO NOT MODIFY BY HAND
 * --------------------------------------
 */
import {registerClientActionRepository} from '/imports/repository/client-action/client-action'
import {registerPermissionRepository} from '/imports/repository/permission/permission'
import {registerSettingsRepository} from '/imports/repository/setting/setting'
import {registerUserRepository} from '/imports/repository/user/user'
import {registerCheckPermissionsService} from '/imports/domain/services/permissions/check-permissions'
import {registerPermissionsPublication} from '/imports/application/dto/permissions/publication'
import {registerDefaultDateProvider} from '/imports/infrastructure/services/date/default-provider'

import {ServiceConfig, ServiceCreator, ServiceLocator} from './service-locator'
import {registry} from './symbols'

const container = ServiceLocator.instance;

const transient = (create: ServiceCreator): ServiceConfig => ({ lifecycle: "per-request", create })

export function register() {
	container.register(registry["repository/client-action/client-action"], transient(registerClientActionRepository));
	container.register(registry["repository/permission/permission"], transient(registerPermissionRepository));
	container.register(registry["repository/setting/setting"], transient(registerSettingsRepository));
	container.register(registry["repository/user/user"], transient(registerUserRepository));
	container.register(registry["domain/permissions/check-permissions"], transient(registerCheckPermissionsService));
	container.register(registry["application/dto/permissions/publication"], transient(registerPermissionsPublication));
	container.register(registry["infrastructure/date/default-provider"], transient(registerDefaultDateProvider));
}
