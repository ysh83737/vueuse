---
category: Utilities
---

# useAsyncSerial

Execute asynchronous tasks serially, so that the results are returned in the order of calls.

## Usage

```ts
import { useAsyncSerial } from '@vueuse/core'

function asyncTask() {
  // do something
}

const { task, clear } = useAsyncSerial(asyncTask)

// The following tasks will be executed in serially, not concurrently.
task()
task()
task()
task()
```
