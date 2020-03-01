import { eachArtifact } from '../src/utils'

describe('eachArtifact', () => {
  test('called with correct arguments', async () => {
    const octokit = {
      actions: {
        listArtifactsForRepo: jest.fn(async () => ({
          data: {
            artifacts: [],
            total_count: 0
          }
        }))
      }
    }
    for await (const artifact of eachArtifact(octokit as any)) {
    }
    expect(octokit.actions.listArtifactsForRepo).toBeCalledWith({
      owner: 'kolpav',
      repo: 'https://github.com/kolpav/purge-artifacts-action',
      page: 1,
      // eslint-disable-line @typescript-eslint/camelcase
      per_page: 100
    })
  })
  test('iterates over all artifacts', async () => {
    const maxPerPage = 100
    const totalCount = 117
    const artifacts = []
    for (let i = 0; i < totalCount; i++) {
      artifacts[i] = i
    }
    const firstListArtifactsForRepoResponse = {
      data: {
        artifacts: artifacts.slice(0, maxPerPage),
        // eslint-disable-line @typescript-eslint/camelcase
        total_count: totalCount
      }
    }
    const secondListArtifactsForRepoResponse = {
      data: {
        artifacts: artifacts.slice(maxPerPage, artifacts.length),
        // eslint-disable-line @typescript-eslint/camelcase
        total_count: totalCount
      }
    }
    const listArtifactsForRepoMock = jest
      .fn()
      .mockResolvedValueOnce(firstListArtifactsForRepoResponse)
      .mockResolvedValueOnce(secondListArtifactsForRepoResponse)
    const octokit = {
      actions: {
        listArtifactsForRepo: listArtifactsForRepoMock
      }
    }
    let artifactIndex = 0
    for await (const artifact of eachArtifact(octokit as any)) {
      expect(artifact).toEqual(artifacts[artifactIndex++])
    }
  })
})
