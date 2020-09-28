import { main, shouldDelete } from '../src/main'
import { sub } from 'date-fns'
import { IActionInputs } from '../src/utils'

describe('shouldDelete', () => {
  test('expired', () => {
    const days = 2
    const expireInMs = days * 86400000
    const expiredArtifact = { created_at: sub(new Date(), { days }) }
    const actionInptus: IActionInputs = {
      expireInMs,
      onlyPrefix: '',
      exceptPrefix: ''
    }
    expect(shouldDelete(expiredArtifact as any, actionInptus)).toEqual(true)
  })
  test('not expired', () => {
    const days = 2
    const expireInMs = (days + 1) * 86400000
    const expiredArtifact = { created_at: sub(new Date(), { days }) }
    const actionInptus: IActionInputs = {
      expireInMs,
      onlyPrefix: '',
      exceptPrefix: ''
    }
    expect(shouldDelete(expiredArtifact as any, actionInptus)).toEqual(false)
  })
  test('expired when expireInDays is zero', () => {
    const expiredArtifact = { created_at: new Date() }
    const actionInptus: IActionInputs = {
      expireInMs: 0,
      onlyPrefix: '',
      exceptPrefix: ''
    }
    expect(shouldDelete(expiredArtifact as any, actionInptus)).toEqual(true)
  })
  test('should delete when matched by onlyPrefix', () => {
    const expiredArtifact = {
      created_at: new Date(),
      name: 'tmp_artifact.test'
    }
    const actionInptus: IActionInputs = {
      expireInMs: 0,
      onlyPrefix: 'tmp',
      exceptPrefix: ''
    }
    expect(shouldDelete(expiredArtifact as any, actionInptus)).toEqual(true)
  })
  test('should not delete when not matched by onlyPrefix', () => {
    const expiredArtifact = {
      created_at: new Date(),
      name: 'build_artifact.test'
    }
    const actionInptus: IActionInputs = {
      expireInMs: 0,
      onlyPrefix: 'tmp',
      exceptPrefix: ''
    }
    expect(shouldDelete(expiredArtifact as any, actionInptus)).toEqual(false)
  })
  test('should delete when not matched by exceptPrefix', () => {
    const expiredArtifact = {
      created_at: new Date(),
      name: 'tmp_artifact.test'
    }
    const actionInptus: IActionInputs = {
      expireInMs: 0,
      onlyPrefix: '',
      exceptPrefix: 'master_'
    }
    expect(shouldDelete(expiredArtifact as any, actionInptus)).toEqual(true)
  })
  test('should not delete when matched by exceptPrefix', () => {
    const expiredArtifact = {
      created_at: new Date(),
      name: 'master_artifact.test'
    }
    const actionInptus: IActionInputs = {
      expireInMs: 0,
      onlyPrefix: '',
      exceptPrefix: 'master_'
    }
    expect(shouldDelete(expiredArtifact as any, actionInptus)).toEqual(false)
  })
  test('should not delete when matched by both onlyPrefix and exceptPrefix', () => {
    const expiredArtifact = {
      created_at: new Date(),
      name: 'master_tmp_artifact.test'
    }
    const actionInptus: IActionInputs = {
      expireInMs: 0,
      onlyPrefix: 'master_',
      exceptPrefix: 'master_tmp_'
    }
    expect(shouldDelete(expiredArtifact as any, actionInptus)).toEqual(false)
  })
  test('should delete when matched by onlyPrefix but not exceptPrefix', () => {
    const expiredArtifact = {
      created_at: new Date(),
      name: 'master_tmp_artifact.test'
    }
    const actionInptus: IActionInputs = {
      expireInMs: 0,
      onlyPrefix: 'master_',
      exceptPrefix: 'tmp_'
    }
    expect(shouldDelete(expiredArtifact as any, actionInptus)).toEqual(true)
  })
})
