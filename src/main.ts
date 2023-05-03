import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    // const webhook = core.getInput('webook', {
    //   required: false
    // })

    // const token = core.getInput('token', {
    //   required: false
    // })

    const event = JSON.parse(core.getInput('event'))
    core.info(JSON.stringify(Object.keys(event.pull_request)))
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
