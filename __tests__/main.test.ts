import { main, shouldDelete } from '../src/main'
import { sub } from 'date-fns'
import { IActionInputs } from '../src/utils'

describe('shouldDelete', () => {
  test('expired', () => {
    const days = 2
    const expireInMs = days * 86400000
    const expiredArtifact = { created_at: sub(new Date(), { days }) }
    const actionInptus: IActionInputs = { expireInMs }
    expect(shouldDelete(expiredArtifact as any, actionInptus)).toEqual(true)
  })
  test('not expired', () => {
    const days = 2
    const expireInMs = (days + 1) * 86400000
    const expiredArtifact = { created_at: sub(new Date(), { days }) }
    const actionInptus: IActionInputs = { expireInMs }
    expect(shouldDelete(expiredArtifact as any, actionInptus)).toEqual(false)
  })
  test('expired when expireInDays is zero', () => {
    const expiredArtifact = { created_at: new Date() }
    const actionInptus: IActionInputs = { expireInMs: 0 }
    expect(shouldDelete(expiredArtifact as any, actionInptus)).toEqual(true)
  })
})
