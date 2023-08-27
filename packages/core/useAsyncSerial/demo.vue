<script lang="ts">
import { onBeforeUnmount, shallowRef } from 'vue'
import { useAsyncSerial, useCounter } from '@vueuse/core'

enum RESULT_TYPE {
  SUCCESS = 'success',
  FAIL = 'fail',
}
interface Result { count: number; type: RESULT_TYPE; message: string}

let loading = false
function asyncTask(): Promise<string> {
  if (loading)
    return Promise.reject(new Error('The service is busy'))

  loading = true
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('success')
      loading = false
    }, 1000)
  })
}
</script>

<script lang="ts" setup>
const { count, inc } = useCounter()

const { task, clear } = useAsyncSerial(asyncTask)

const results = shallowRef<Result[]>([])
async function onQueueLoad() {
  inc()
  const result: Result = { count: count.value, type: RESULT_TYPE.SUCCESS, message: '' }
  try {
    result.message = await task()
  }
  catch (error) {
    result.type = RESULT_TYPE.FAIL
    result.message = (error as Error).message
  }
  results.value = [...results.value, result]
}
onBeforeUnmount(() => {
  clear()
})
</script>

<template>
  <div>
    <button @click="onQueueLoad">
      <div>
        Quick clicks me
      </div>
      <div>(count: {{ count }})</div>
    </button>
    <div class="mt-4 leading-6">
      <div
        v-for="(item, index) in results"
        :key="index"
        :class="{
          'text-red-500': item.type === RESULT_TYPE.FAIL,
          'text-green-500': item.type === RESULT_TYPE.SUCCESS,
        }"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>
