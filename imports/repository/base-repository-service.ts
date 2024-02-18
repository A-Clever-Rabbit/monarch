import {Mongo, MongoInternals} from 'meteor/mongo'
import {ClientSession, OptionalId, FilterQuery, Cursor, UpdateQuery} from 'mongodb'
import {createDefaultDateProvider, IDateProvider} from '/imports/infrastructure/services/date/default-provider'

declare module 'meteor/mongo' {
  export module Mongo {
    export interface Collection<T, U> {
      _name: string
    }
  }
}
/**
 * Creates a Repo service for a given collection, constrained with BaseDocument
 */

export type FindOptions<TDOC extends BaseDocument> = Mongo.Options<TDOC> & {
  fields?: {
    [K in keyof Omit<Partial<TDOC>, '_id'>]: 1
  }
}

export type BaseDocument = {
  _id: string
  createdAt: Date
  updatedAt: Date
}

export type IRepository<TDOC extends BaseDocument> = {
  collection: () => Mongo.Collection<TDOC, TDOC>
  name: () => string
  count: (selector?: Mongo.Selector<TDOC>) => Promise<number>
  list: (selector?: Mongo.Selector<TDOC>, options?: Mongo.Options<TDOC>) => Mongo.Cursor<TDOC>
  listWithSession: (session : ClientSession, selector?: FilterQuery<TDOC>) => Cursor<TDOC>
  create: (doc: Omit<TDOC, '_id' | 'createdAt' | 'updatedAt'>) => string
  createWithSession: (doc: Omit<TDOC, '_id' | 'createdAt' | 'updatedAt'>, session: ClientSession) => Promise<string>
  get: (id: string, ) => TDOC
  getWithSession: (id: string, session : ClientSession) => Promise<TDOC>
  findOne: (selector?: Mongo.Selector<TDOC>) => TDOC
  findOneWithSession: (selector: FilterQuery<TDOC>, session : ClientSession) => Promise<TDOC>
  update: (id: string, update: Partial<Omit<TDOC, '_id' | 'createdAt' | 'updatedAt'>>, unsetField?: Partial<Record<keyof TDOC, string>>) => number
  updateWithSession: (id: string, update: Partial<Omit<TDOC, '_id' | 'createdAt' | 'updatedAt'>>, session: ClientSession, unsetField?: Partial<Record<keyof TDOC, string>>) => Promise<number>
  updateMany: (selector: Mongo.Selector<TDOC>, update: Partial<Omit<TDOC, '_id' | 'createdAt' | 'updatedAt'>>) => number
  remove: (id: string) => number
  getAll: (ids: string[], options?: Mongo.Options<TDOC>) => TDOC[]
  getAllOrThrow: (ids: string[]) => TDOC[]
  validateExist: (id: string) => void
  validateAllExist: (ids: string[]) => void

  startSession: () => ClientSession
}

export function createBaseRepositoryService<TDOC extends BaseDocument>(
  collection: Mongo.Collection<TDOC, TDOC>,
  dateProvider: IDateProvider = createDefaultDateProvider()
): IRepository<TDOC> {
  return {

    startSession: () => {
      const mongo = MongoInternals.defaultRemoteCollectionDriver().mongo;
      const session = mongo.client.startSession();
      return session;      
    },

    collection: () => collection,
    
    name: () => collection._name,

    count: (selector = {}) => {
      return collection.countDocuments(selector);
    },

    list: (selector = {}, options = {}) => {
        return collection.find(selector, options);
    },

    listWithSession: (session: ClientSession, selector = {}) => {
        return collection.rawCollection().find(selector, {session: session});
    },    

    create: (doc) => {
      return collection.insert({
        ...doc,
        _id: new Mongo.ObjectID().toHexString(),
        createdAt: dateProvider(),
        updatedAt: dateProvider(),
      } as Mongo.OptionalId<TDOC>);
    },

    createWithSession: async (doc, session) => {
      const itemWithID = { 
        _id: new Mongo.ObjectID().toHexString(),         
        createdAt: dateProvider(),
        updatedAt: dateProvider(), 
        ...doc, 
      };
      const result = await collection.rawCollection().insertOne(itemWithID as OptionalId<TDOC>, {session: session});
      return result.insertedId;
    },

    get: (id) => {
      const doc = collection.findOne(id);

      if (!doc) {
        throw new EntityIdNotFound(collection._name, id);
      }

      return doc;
    },

    getWithSession: async (id, session) => {
      const  doc = await collection.rawCollection().findOne({ "_id" : id } as FilterQuery<TDOC>, {session: session});
      if (!doc) {
        throw new EntityIdNotFound(collection._name, id);
      }

      return doc;
    },    

    findOne: (selector = {}) => {
      const doc = collection.findOne(selector);
      if (!doc) {
        throw new EntityQueryNotFound(collection._name, selector);
      }
      return doc;
    },

    findOneWithSession: async (selector = {}, session) => {
      const  doc = await collection.rawCollection().findOne(selector, {session: session});
      if (!doc) {
        throw new EntityQueryNotFound(collection._name, selector);
      }
      return doc;
    },    

    update: (id, update, unsetField) => {
      return collection.update(id, {
        $set: {
          ...update as Partial<TDOC>,
          updatedAt: dateProvider(),
        },
        $unset: unsetField
      })
    },

    updateWithSession: async (id, update, session, unsetField) => {
      const result = collection.rawCollection().updateOne({ "_id" : id } as FilterQuery<TDOC>, {
        $set: {
          ...update as Partial<TDOC>,
          updatedAt: dateProvider(),
        },
        $unset: unsetField 
      } as UpdateQuery<TDOC>, {session: session});

      return result.then((res)=> {return res.modifiedCount;});
    },    

    updateMany: (selector, update) => {
      return collection.update(selector, {
        $set: {
          ...update as Partial<TDOC>,
          updatedAt: dateProvider(),
        },
      })
    },

    remove: (id) => {
      return collection.remove(id);
    },

    getAll: (ids) => {
      return collection.find({_id: {$in: ids as []}}).fetch();
    },

    getAllOrThrow: (ids) => {
      // Don't know why we have to as [], but it complains otherwise, even though a string[] should be valid
      const foundItems = collection.find({_id: {$in: ids as []}}).fetch();
      const foundItemIds = foundItems.map(item => item._id);
      const missingItemIds = ids.filter(itemId => !foundItemIds.includes(itemId));

      if (missingItemIds.length > 0) {
        throw new AllEntitiesNotFound(collection._name, missingItemIds);
      }

      return foundItems;
    },

    validateExist: (id) => {
      if (collection.find(id).count() !== 1) {
        throw new EntityIdNotFound(collection._name, id);
      }
    },

    validateAllExist: (ids) => {
      // Don't know why we have to as [], but it complains otherwise, even though a string[] should be valid
      const foundItems = collection.find({_id: {$in: ids as []}}, {fields: {_id: 1}}).fetch();
      const foundItemIds = foundItems.map(item => item._id);
      const missingItemIds = ids.filter(itemId => !foundItemIds.includes(itemId));

      if (missingItemIds.length > 0) {
        throw new AllEntitiesNotFound(collection._name, missingItemIds);
      }
    }
  }
}

export class EntityNotFound extends Error {
}

export class EntityIdNotFound extends EntityNotFound {
  constructor(
    public entityName: string,
    public id: string
  ) {
    super(`Could not find ${entityName} with id ${id}`)
  }
}

export class EntityQueryNotFound extends EntityNotFound {
  constructor(
    public entityName: string,
    public query: Mongo.Selector<any>
  ) {
    super(`Could not find ${entityName} with query ${JSON.stringify(query)}`)
  }
}

export class AllEntitiesNotFound extends EntityNotFound {
  constructor(
    public entityName: string,
    public ids: string[]
  ) {
    super(`Could not find ${entityName} with ids [${ids.join(', ')}]`)
  }
}

/**
 * Example usage:

 type TestDocument = BaseDocument & {
  name: string
  description: string
}

 const TestCollection = new Mongo.Collection<TestDocument>('test');

 type TTestService = TCRUDService<TestDocument> & {
  search: (s: string) => Mongo.Cursor<TestDocument, TestDocument>
}

 function createTestRepository(): TTestService {
  const service = createCRUDService(TestCollection);
  return {
    ...service,
    search: (s) => {
      return service.list({ name: s }, {});
    }
  }
}

 */
