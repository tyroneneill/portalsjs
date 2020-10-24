export class DeferredPromise<T> extends Promise<T> {

  private readonly executor: { resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void }

  constructor() {
    let executor: { resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void }
    super((resolve, reject) => {
      return executor = { resolve, reject }
    })
    // @ts-ignore
    this.executor = executor
    // Set the prototype explicitly.
    // See: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, DeferredPromise.prototype)
  }

  public resolve(value?: T | PromiseLike<T>): void {
    this.executor.resolve(value)
  }

  public reject(reason?: any): void {
    this.executor.reject(reason)
  }
}
