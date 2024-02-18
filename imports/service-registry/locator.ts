import {registry} from './symbols'
import {ServiceLocator} from './service-locator'

export type ServiceLocatorFunction = <T>(key: keyof typeof registry) => T;

type ServiceLocatorFunctionWithContext = <T>(key: keyof typeof registry) => T;
export const locate: ServiceLocatorFunctionWithContext = <T>(key: keyof typeof registry, context: any = undefined): T => {
    if (!registry[key]) {
        throw new Error(`Service '${key}' is not in the registry`);
    }

    ServiceLocator.instance.context = context;
    return ServiceLocator.instance.resolve<T>(registry[key])
}
