import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'

/**
 * 基础列表状态
 * - 不含分页
 * @param query 查询方法
 */
export function useBaseList<
  Query extends (params: any) => Promise<List<any>>,
  T = Query extends (params: any) => Promise<List<infer Item>>
    ? Item
    : any,
>(query: Query) {
  const loading = ref(false)
  const setLoading = (value: boolean) => {
    loading.value = value
  }
  const list: Ref<T[]> = ref([])

  const doQuery = async function (params) {
    let output: List<T>
    setLoading(true)
    try {
      const result = await query(params)
      list.value = result.records
      output = result
    }
    catch (error) {
      console.error('[error][useBaseList]', (error as Error)?.message || error)
      output = Promise.reject(error) as never
    }
    setLoading(false)
    return output
  } as Query

  return {
    loading,
    setLoading,
    /** 列表数据 */
    list,
    /**
     * 执行查询
     * @param params 完整参数，需要包含分页参数
     */
    query: doQuery,
    /** 重置状态 */
    reset() {
      loading.value = false
      list.value = []
    },
  }
}

/** 列表信息 */
export interface List<T> {
  /** 数据 */
  records: T[]
  /** 总条目数 */
  total: number
}
