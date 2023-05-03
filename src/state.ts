type Issue = {
  body: string
}

interface UpdateStatePayload {
  webhook: string
  action: string
  pr: number
  issues: Issue[]
}

// interface PullRequest {
// 	body?: string,
// 	merged: boolean,
// 	number: number,
// 	state: string
// }

// type PRStatus =
//   | 'opened'
//   | 'closed'
//   | 'reopened'
//   | 'review_requested'
//   | 'review_request_removed'
//   | 'merged'
// type NotionState = 'no'

function MapPRStateToNotionState(): string {
  // unimplemented
  return 'hello'
}

export function updateState(payload: UpdateStatePayload): void {
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
          state: MapPRStateToNotionState(),
          pr: payload.pr
        })
      })
    }
  }
}
