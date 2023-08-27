export type UseAsyncSerialTask<R> = (...args: any[]) => Promise<R>

export type QueueTask = () => Promise<void>

/**
 * remote request queue,
 * suitable for interfaces that cannot request frequently (simultaneously)
 * @param task the remote(request) method
 * @param interval the interval between requests
 */
export function useAsyncSerial<R>(task: UseAsyncSerialTask<R>, interval?: number) {
  /** request queue */
  let queue: QueueTask[] = []
  /** doing remote request */
  let loading = false

  async function taskWrapper(...args: any[]): Promise<R> {
    const result = new Promise<R>((resolve) => {
      queue.push(() => {
        return task(...args)
          .then(resolve)
          .catch(error => resolve(Promise.reject(error)))
          .finally(() => {
            // release closure variables
            resolve = null as never
            args = null as never
          })
      })
    })

    invoke()

    return result
  }

  /** invoke remote request task in queue */
  async function invoke() {
    if (loading)
      return

    // first-in first-out
    const curr = queue.shift()
    if (!curr)
      return

    loading = true
    await curr()
    loading = false

    if (interval) {
      // delay invoke
      setTimeout(invoke, interval)
    }
    else {
      invoke()
    }
  }

  function clear() {
    queue.splice(0, queue.length)
    queue = null as never
    loading = null as never
  }

  return {
    /**
     * remote(request) method with queue handler
     * @param {any} params request params, usually query keyword
     */
    task: taskWrapper,
    /** clear queue and closure variables */
    clear,
  }
}
