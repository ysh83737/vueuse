import { describe, expect, it } from 'vitest'
import { useAsyncSerial } from '.'

describe('useCounter', () => {
  it('should be defined', () => {
    expect(useAsyncSerial).toBeDefined()
  })
})
