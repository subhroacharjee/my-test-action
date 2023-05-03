import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const webhook = core.getInput('webook', {
      required: false
    })

    const token = core.getInput('token', {
      required: false
    })

    const event = JSON.parse(core.getInput('event'))
    core.info([webhook, token].join(' '))

    const context = github.context
    core.info(context.eventName)
    core.info(event.action)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
