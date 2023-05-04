import axios from 'axios'
import * as Types from './types'

function MapPRStateToNotionState(event: Types.GithubEvent): Types.NotionState {
  // unimplemented
  switch (event.action) {
    case 'opened':
    case 'reopened':
      return 'in-progress'

    case 'closed': {
      if (event.merged) return 'for-qa'
      else return 'archived'
    }

    case 'submitted': {
      if (event.reviewState !== 'approved') return 'fixes-required'
      else return 'in-progress'
    }
    case 'created': {
      return 'fixes-required'
    }

    default:
      throw new Error('Invalid action')
  }
}

export async function updateState(
  payload: Types.UpdateStatePayload
): Promise<void> {
  for (const {body} of payload.issues) {
    if (body.includes('ID:')) {
      const ID = body.split('ID: ')[1]
      await axios.post(payload.webhook, {
        id: ID,
        state: MapPRStateToNotionState(payload.event),
        pr: payload.event.pr
      })
    }
  }
}
