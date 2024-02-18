export type IDateProvider = () => Date

export function createDefaultDateProvider(): IDateProvider {
  return () => new Date();
}

export function registerDefaultDateProvider() {
  return createDefaultDateProvider();
}
