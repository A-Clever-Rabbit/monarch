import {ServiceLocatorFunction} from './locator'
import {registry} from '/imports/service-registry/symbols'

export type ServiceCreator = (locate: ServiceLocatorFunction, context: any) => any;

export type ServiceConfig = {
    lifecycle: 'singleton' | 'per-request',
    create: ServiceCreator,
    _instance?: any
}
export class ServiceLocator {
    public context: any;
    private services = new Map<symbol, ServiceConfig>();
    private static _instance: ServiceLocator | undefined;

    static get instance(): ServiceLocator {
        if (!this._instance) {
            this._instance = new ServiceLocator();
        }
        return this._instance;
    }

    /**
     * Replace a service with a new implementation (Use with caution) // We currently use this to replace the date provider for the seeder
     * @param key
     * @param config
     */
    replace(key: symbol, config: ServiceConfig) {
        for(const [, service] of this.services.entries()) {
            delete service._instance;
        }
        this.services.set(key, config);
    }

    register(key: symbol, config: ServiceConfig) {
        // Throw an error if the key is already registered
        if (this.services.has(key)) {
            throw new Error(`Service ${key.toString()} already registered`);
        }
        this.services.set(key, config);

        return this;
    }

    resolve<T>(key: symbol): T {
        const config = this.services.get(key);

        if (!config) {
            throw new Error(`Service ${key.toString()} not registered`);
        }

        const locate = <T>(key: keyof typeof registry) => this.resolve<T>(registry[key]);

        switch (config.lifecycle) {
            case 'singleton':
                if (!config._instance) {
                    config._instance = config.create(locate, this.context);
                }
                return config._instance;
            case 'per-request':
                return config.create(locate, this.context);
        }
    }
}

