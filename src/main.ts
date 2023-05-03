import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    // const webhook = core.getInput('webook', {
    //   required: false
    // })

    const token = core.getInput('token', {
      required: false
    })

    const event = JSON.parse(core.getInput('event'))
    const octokit = github.getOctokit(token)
    const gqlVariables = {
      $owner: github.context.repo.owner,
      $name: github.context.repo.repo,
      $pr: event.pull_request.number
    }

    core.info(JSON.stringify(gqlVariables))
    const result = await octokit.graphql(
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
      gqlVariables
    )

    core.info(JSON.stringify(result))
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
