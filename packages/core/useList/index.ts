import { usePager } from '../usePager'
import type { Pager } from '../usePager'
import { useBaseList } from '../useBaseList'
import type { List } from '../useBaseList'

/**
 * 列表状态
 * - 内含分页
 * - 自动填充分页参数
 * @param query 查询方法
 */
export function useList<
  Query extends (params: any) => Promise<List<any>>,
  FilterQuery = Query extends (
    params: Pager & infer P,
  ) => Promise<List<infer Item>>
    ? (params: P) => Promise<List<Item>>
    : Query,
  T = Query extends (params: any) => Promise<List<infer Item>>
    ? Item
    : any,
>(query: Query) {
  const pager = usePager()

  /** 不含分页参数的查询方法 */
  const filterQuery = async function (params: any) {
    const fullParams = {
      ...params,
      // 填充分页参数
      page: pager.page.value,
      pageSize: pager.pageSize.value,
    }
    // 执行完整查询
    const result = await query(fullParams)
    pager.setTotal(result.total)
    return result
  } as FilterQuery

  const baseList = useBaseList<
    FilterQuery extends Query ? FilterQuery : Query,
    T
  >(filterQuery as never)

  return {
    ...pager,
    ...baseList,
    /**
     * 执行查询
     * @param params 筛选参数，不需要分页参数
     */
    query: baseList.query,
    /** 重置分页、列表状态 */
    reset() {
      pager.reset()
      baseList.reset()
    },
  }
}
