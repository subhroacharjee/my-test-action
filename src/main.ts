import * as core from '@actions/core'
import * as github from '@actions/github'

import * as Types from './types'
import {updateState} from './state'

async function run(): Promise<void> {
  try {
    const webhook = core.getInput('webhook', {
      required: true
    })

    const token = core.getInput('token', {
      required: true
    })
    const event = JSON.parse(core.getInput('event'))

    const ghEvent: Types.GithubEvent = {
      action: event.action,
      owner: github.context.repo.owner,
      name: github.context.repo.repo,
      pr: event.pull_request.number,
      merged: event.pull_request.merged,
      body: event.pull_request.body,
      reviewState: event.review?.state
    }

    const octokit = github.getOctokit(token)

    const result: Types.RepositoryResponse = await octokit.graphql(
      `
      query($owner: String!, $name: String!, $pr: Int!) {
      repository(owner: $owner, name: $name) {
        pullRequest(number: $pr) {
          closingIssuesReferences(first: 10) {
            nodes {
              body
            }
          }
        }
      }
    }
    `,
      {
        owner: ghEvent.owner,
        name: ghEvent.name,
        pr: ghEvent.pr
      }
    )

    await updateState({
      issues: result.repository.pullRequest.closingIssuesReferences.nodes,
      event: ghEvent,
      webhook
    })
  } catch (error) {
    core.info(JSON.stringify(error))
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
