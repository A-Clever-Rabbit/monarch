// The middleware function type
type MiddlewareFunction<T extends {}, R extends {} = T> = (context: T) => R | Promise<R>;

// Middleware dispatcher class
export class MiddlewareDispatcher<TContext extends {}> {
  private middleware: MiddlewareFunction<any, any>[] = [];
  private context = {} as TContext;

  static create<T extends {}>(context: T) {
    const dispatcher = new MiddlewareDispatcher<T>();
    dispatcher.context = context;
    return dispatcher;
  }

  // Add middleware function
  use<TNextContext extends TContext>(fn: MiddlewareFunction<TContext, TNextContext>): MiddlewareDispatcher<TNextContext> {
    const newDispatcher = new MiddlewareDispatcher<TNextContext>();
    newDispatcher.middleware = [...this.middleware, fn];
    newDispatcher.context = this.context as TNextContext;
    return newDispatcher;
  }

  callback<TNextContext extends TContext>(fn: MiddlewareFunction<TContext, TNextContext>) {
    return fn;
  }

  // Dispatch the middleware chain
  async dispatch() {
    for (const middleware of this.middleware) {
      this.context = await middleware(this.context);
    }
    return this.context;
  }
}
