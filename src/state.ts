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

export function updateState(payload: Types.UpdateStatePayload): void {
  for (const {body} of payload.issues) {
    if (body.includes('ID:')) {
      const ID = body.split('ID: ')[1]
      fetch(payload.webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: ID,
          state: MapPRStateToNotionState(payload.event),
          pr: payload.event.pr
        })
      })
    }
  }
}
