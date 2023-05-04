type Action = 'opened' | 'closed' | 'reopened' | 'submitted' | 'created'

type ReviewState = 'commented' | 'change_requested' | 'approved'

export type GithubEvent = {
  action: Action
  owner: string
  name: string
  pr: number
  merged?: boolean
  reviewState?: ReviewState
  body?: string
}

type Issue = {
  body: string
}

export type RepositoryResponse = {
  repository: {
    pullRequest: {
      closingIssuesReferences: {
        nodes: Issue[]
      }
    }
  }
}

export type UpdateStatePayload = {
  webhook: string
  event: GithubEvent
  issues: Issue[]
}

export type NotionState =
  | 'in-progress'
  | 'archived'
  | 'for-qa'
  | 'fixes-required'
