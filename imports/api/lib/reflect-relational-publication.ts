import {Meteor, Subscription} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'
import _ from 'lodash'

class InnerCursor<T> {
  constructor(
    public readonly cursor: Mongo.Cursor<T>,
    public readonly single = false,
    public readonly transform?: any
  ) {}
}

function getDifferences(objA: object, objB: object) {
  const differences: Record<string, any> = {};

  _.forOwn(objB, (value, key) => {
    if (!_.isEqual(value, objA[key as keyof typeof objA])) {
      differences[key] = value;
    }
  });

  return differences;
}

function subscriptionKeyPathToLodashKeyPath(keyPath: string) {
  return _.chain(keyPath)
    .split(".")
    .map((key) => {
      if(!isNaN(parseInt(key))) {
        return `[${key}]`;
      }
      return key;
    })
    .join(".")
    .value()
}

type Transform<ReflectedDoc, Doc extends CursorDoc> = {
  [
  K in keyof Omit<Partial<ReflectedDoc>, '_id'>
  ]: (doc: Doc) => ReflectedDoc[K] | InnerCursor<any>
}

type InnerArgs<ReflectedDoc, Doc extends CursorDoc> = {
  cursor: Mongo.Cursor<Doc, Doc>
  transform?: Transform<ReflectedDoc, Doc>
  single?: boolean
}

export function useCache<T>(key: string, fn: () => T, cache: Map<string, T>) {
  if(!cache.has(key)) {
    cache.set(key, fn());
  }
  return cache.get(key)!;
}

/**
 * Creates a function to build inner cursors. This function is only used to provide a type definition for ReflectedDoc
 */
export function inner<ReflectedDoc>() {
  /**
   * Create the innerCursor for a related collection. IMPORTANT: Don't use limit within innerCursors. It slows reactivity
   * to a crawl.
   *
   * @param cursor
   * @param transform
   * @param single
   */
  return function<Doc extends CursorDoc>({ cursor, transform, single = false }: InnerArgs<ReflectedDoc, Doc>) {
    return new InnerCursor(cursor, single, transform);
  }
}

function createTransform<Doc extends CursorDoc>(
  topDoc: Doc,
  subscription: Subscription,
  transform: Transform<any, Doc>,
  collection: Mongo.Collection<any>,
  liveQueries: Map<string, Meteor.LiveQueryHandle>
) {
  return function (parentDoc: any, parentKey = "") {
    return _.mapValues(transform, (transformFunction, transformKey) => {
      const result = transformFunction(parentDoc);

      if(result instanceof InnerCursor) {
        let key = `${parentKey ? `${parentKey}.`:""}${transformKey}`;
        let lodashKey = subscriptionKeyPathToLodashKeyPath(key);

        const innerDocs = new Map<string, any>();
        const execTransform = result.transform
          ? createTransform(topDoc, subscription, result.transform, collection, liveQueries)
          : () => undefined;

        const queryKey = `${topDoc._id}.${key}`
        if(!liveQueries.get(queryKey)) {
          // console.log("start innerObserver", key);
          const observer = result.cursor.observeChanges({
            added: (id, fields) => {
              // console.log("inner added", key);
              let key = `${parentKey ? `${parentKey}.`:""}${transformKey}`;
              let lodashKey = subscriptionKeyPathToLodashKeyPath(key);

              if(!result.single) {
                const subCollection = _.get(topDoc, lodashKey, []) as any[];
                let index = _.findIndex(subCollection, { _id: id });
                index = index === -1 ? subCollection.length : index;
                key = `${key}.${index}`;
                lodashKey = subscriptionKeyPathToLodashKeyPath(key);
              }

              const doc = { _id: id, ...fields };
              // Added needs an _id because this is a sub document in the reflection (_id is just another field)
              const added = { _id: id  , ...fields, ...execTransform(doc, key) };
              innerDocs.set(id, { ...doc, ...added });

              const existing = _.get(topDoc, lodashKey);
              const newSubDoc = _.merge(existing, added);
              _.set(topDoc, lodashKey, newSubDoc);

              const keyMappedChange = _.chain(added)
                .mapKeys((_v, k) => `${key}.${k}`)
                .value();

              try {
                subscription.changed(collection._name, topDoc._id, keyMappedChange);
              } catch (err) {
                subscription.added(collection._name, topDoc._id, _.set({}, lodashKey, added));
              }
            },
            changed: (id, fields) => {
              // console.log("inner changed", key);
              let key = `${parentKey ? `${parentKey}.`:""}${transformKey}`;
              let lodashKey = subscriptionKeyPathToLodashKeyPath(key);

              if(!result.single) {
                const subCollection = _.get(topDoc, lodashKey, []) as any[];
                let index = _.findIndex(subCollection, { _id: id });
                index = index === -1 ? subCollection.length : index;
                key = `${key}.${index}`;
                lodashKey = subscriptionKeyPathToLodashKeyPath(key);
              }

              const doc = innerDocs.get(id);
              const changed = getDifferences(doc, { ...fields, ...execTransform({ ...doc, ...fields }, key) });
              innerDocs.set(id, { ...doc, ...changed });

              const existing = _.get(topDoc, lodashKey);
              const newSubDoc = _.merge(existing, changed);
              _.set(topDoc, lodashKey, newSubDoc);

              const keyMappedChange = _.mapKeys(changed, (_v, k) => `${key}.${k}`);

              subscription.changed(collection._name, topDoc._id, keyMappedChange);
            },
            removed: (id) => {
              // console.log("inner removed", key);

              let key = `${parentKey ? `${parentKey}.`:""}${transformKey}`;
              let lodashKey = subscriptionKeyPathToLodashKeyPath(key);

              if(!result.single) {
                const subCollection = _.get(topDoc, lodashKey, []) as any[];
                let index = _.findIndex(subCollection, { _id: id });
                index = index === -1 ? subCollection.length : index;
                key = `${key}.${index}`;
                lodashKey = subscriptionKeyPathToLodashKeyPath(key);
              }

              innerDocs.delete(id);
              _.unset(topDoc, lodashKey);

              for(const [ currentQueryKey, liveQuery ] of liveQueries.entries()) {
                if(currentQueryKey.startsWith(queryKey)) {
                  // console.log("stop innerObserver because", key, "was removed");
                  liveQuery.stop();
                  liveQueries.delete(queryKey);
                }
              }

              subscription.changed(collection._name, topDoc._id, { [key]: undefined });
            },
          });

          liveQueries.set(queryKey, observer);

          subscription.onStop(() => {
            // console.log("stop innerObserver", key);
            observer.stop();
          });
        }

        return result.single ? _.get(topDoc, lodashKey) : _.get(topDoc, lodashKey, undefined);
      } else {
        return result;
      }
    });
  }
}

type CursorDoc = { _id: string }

type ReflectArgs<ReflectedDoc, Doc extends CursorDoc> = {
  subscription: Subscription
  cursor: Mongo.Cursor<Doc, Doc>
  collection: Mongo.Collection<ReflectedDoc, ReflectedDoc>
  transform?: Transform<ReflectedDoc, Doc>
}
export function reflect<ReflectedDoc, Doc extends CursorDoc>({ cursor, collection, subscription, transform }: ReflectArgs<ReflectedDoc, Doc>) {
  const docs = new Map<string, Doc>();
  const liveQueries = new Map<string, Meteor.LiveQueryHandle>();

  // console.log("start outerObserver");
  const observer = cursor.observeChanges({
    added: (id, fields) => {
      // console.log("toplevel added");
      const doc = { _id: id, ...fields } as Doc;
      const execTransform = transform ? createTransform(doc, subscription, transform, collection, liveQueries) : () => {};
      docs.set(id, doc);
      const added = { ...fields, ...execTransform(doc) };

      subscription.added(collection._name, id, _.pickBy(added, (v) => v !== undefined));
    },
    changed: (id, fields) => {
      // console.log("toplevel changed");
      const doc = docs.get(id)!;
      const execTransform = transform ? createTransform(doc, subscription, transform, collection, liveQueries) : () => {};
      const changed = { ...fields, ...execTransform({ ...doc, ...fields }) };
      docs.set(id, { ...doc, ...changed });
      subscription.changed(collection._name, id, changed);
    },
    removed: (id) => {
      // console.log("toplevel removed");
      docs.delete(id);

      for(const [ queryKey, liveQuery ] of liveQueries.entries()) {
        if(queryKey.startsWith(id)) {
          // console.log("stop innerObserver", queryKey, "because topDoc", id, "was removed");
          liveQuery.stop();
          liveQueries.delete(queryKey);
        }
      }

      subscription.removed(collection._name, id);
    },
  });

  subscription.ready();

  subscription.onStop(() => {
    // console.log("stop outerObserver");
    observer.stop();
  });
}
