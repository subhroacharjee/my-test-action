import * as core from '@actions/core'
import * as github from '@actions/github'

type Action =
  | 'opened'
  | 'closed'
  | 'reopened'
  | 'review_requested'
  | 'submitted'
  | 'edited'
  | 'created'

type ReviewState = 'commented' | 'change_requested' | 'approved'

type GithubEvent = {
  action: Action
  owner: string
  name: string
  pr: number
  merged?: boolean
  reviewState?: ReviewState
  body?: string
}

interface RepositoryResponse {
  repository: {
    pullRequest: {
      closingIssuesReferences: {
        nodes: {body: string}[]
      }
    }
  }
}

async function run(): Promise<void> {
  try {
    // const webhook = core.getInput('webook', {
    //   required: true
    // })

    const token = core.getInput('token', {
      required: true
    })
    const event = JSON.parse(core.getInput('event'))

    const ghEvent: GithubEvent = {
      action: event.action,
      owner: github.context.repo.owner,
      name: github.context.repo.repo,
      pr: event.pull_request.number,
      merged: event.pull_request.merged,
      body: event.pull_request.body,
      reviewState: event.review?.state
    }

    const gqlVariables = {
      owner: github.context.repo.owner,
      name: github.context.repo.repo,
      pr: event.pull_request.number
    }

    const octokit = github.getOctokit(token)
    core.info(github.context.eventName)
    core.info(JSON.stringify(ghEvent))
    const result: RepositoryResponse = await octokit.graphql(
      `query($owner: String!, $name: String!, $pr: Int!) {
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
      gqlVariables
    )

    core.debug(JSON.stringify(result))
  } catch (error) {
    core.info(JSON.stringify(error))
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
