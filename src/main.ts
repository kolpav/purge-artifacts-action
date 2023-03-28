import * as core from '@actions/core'
import * as github from '@actions/github'
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'
import {
  getOctokit,
  eachArtifact,
  getActionInputs,
  IActionInputs
} from './utils'

export function shouldDelete(
  artifact: ActionsListArtifactsForRepoResponseArtifactsItem,
  actionInputs: IActionInputs
): boolean {
  const { expireInMs, onlyPrefix, exceptPrefix } = actionInputs

  const included = onlyPrefix === '' || artifact.name.startsWith(onlyPrefix)
  const excluded = exceptPrefix && artifact.name.startsWith(exceptPrefix)
  const expired =
    differenceInMilliseconds(new Date(), new Date(artifact.created_at)) >=
    expireInMs

  return included && !excluded && expired
}

export async function main(): Promise<void> {
  try {
    const actionInputs = getActionInputs()

    const octokit = getOctokit()

    const deletedArtifacts = []
    for await (const artifact of eachArtifact(octokit)) {
      if (shouldDelete(artifact, actionInputs)) {
        deletedArtifacts.push(artifact)
        // eslint-disable-next-line i18n-text/no-en
        core.debug(`Deleting artifact:\n${JSON.stringify(artifact, null, 2)}`)
        await octokit.actions.deleteArtifact({
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          artifact_id: artifact.id
        })
      }
    }
    core.setOutput('deleted-artifacts', JSON.stringify(deletedArtifacts))
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

main()
