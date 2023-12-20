import { reactive, toRefs } from 'vue-demi'

const DEFAULT_PAGER: Pager = {
  page: 1,
  pageSize: 10,
  total: 0,
}

/** 分页 */
export function usePager() {
  const pager = reactive<Pager>({ ...DEFAULT_PAGER })

  return {
    ...toRefs(pager),
    /**
     * 设置页码
     * @param value 页码
     */
    setPage(value: number) {
      return (pager.page = value)
    },
    /** 页码+1 */
    addPage() {
      return ++pager.page
    },
    /**
     * 设置分页大小
     * @param value 页码
     */
    setPageSize(value: number) {
      return (pager.pageSize = value)
    },
    /**
     * 设置总条目数
     * @param value 数量
     */
    setTotal(value: number) {
      return (pager.total = value)
    },
    /** 重置分页数据 */
    reset() {
      Object.assign(pager, DEFAULT_PAGER)
    },
  }
}

/** 分页数据 */
export interface Pager {
  /** 页码 */
  page: number
  /** 分页大小 */
  pageSize: number
  /** 总条目数 */
  total: number
}
