import { CancelToken, isCancel } from 'axios'

const DEFAULT = 'DEFAULT'
const PENDING = 'PENDING'
const SUCCEDED = 'SUCCEDED'
const FAILED = 'FAILED'

export default class Action {
  constructor(createRequest, onStatusUpdate) {
    this.createRequest = createRequest
    this.onStatusUpdate = onStatusUpdate
    this.status = DEFAULT
    this.error = undefined
    this.result = undefined
    this.key = undefined
  }

  getState = () => {
    return {
      isDefault: this.status === DEFAULT,
      isPending: this.status === PENDING,
      isSucceded: this.status === SUCCEDED,
      isFailed: this.status === FAILED,
      result: this.result,
      error: this.error,
      reset: this.reset,
      run: this.run,
    }
  }

  updateKey = () => {
    this.key = Math.random()
    return this.key
  }

  updateStatus({ key, status, result, error, updateComponent }) {
    if (key !== this.key) return
    this.status = status
    this.result = result
    this.error = error
    this.onStatusUpdate(updateComponent)
  }

  abort = () => {
    if (this.status === PENDING) {
      this.cancelTokenSource.cancel()
    }
  }

  run = async ({
    params = [],
    silent = true,
    abortPending = true,
    updateComponent = true,
    updateComponentOnPending = true,
    updateComponentOnSuccess = true,
    updateComponentOnFailure = true,
  } = {}) => {
    // Create new key
    const key = this.updateKey()

    // Cancel already pending request
    if (abortPending) this.abort()

    // Create new cancel token source
    this.cancelTokenSource = CancelToken.source()

    // Change status to pending
    this.updateStatus({
      key,
      status: PENDING,
      updateComponent: updateComponentOnPending && updateComponent
    })

    try {
      // Create action passing cancel token to creator
      const request = this.createRequest(this.cancelTokenSource.token)

      // Call action
      const result = await request(...params)

      // Update status to succeded
      this.updateStatus({
        key,
        result,
        status: SUCCEDED,
        updateComponent: updateComponentOnSuccess && updateComponent
      })
    } catch (error) {
      if (isCancel(error)) {
        // Request has been cancelled, update status to default
        this.updateStatus({
          key,
          status: DEFAULT,
          updateComponent: updateComponentOnFailure && updateComponent
        })
      } else {
        // Action failed, update status to failed
        this.updateStatus({
          key,
          error,
          status: FAILED,
          updateComponent: updateComponentOnFailure && updateComponent
        })
      }

      // Throw error to upper scope
      if (!silent) throw error
    }

    // Return action result
    return this.result
  }

  reset = ({
    abortPending = true,
    updateComponent = true,
  } = {}) => {
    if (this.status === DEFAULT) {
      return
    }

    this.updateKey()

    if (abortPending) {
      this.abort()
    }

    this.updateStatus({
      key: this.key,
      status: DEFAULT,
      updateComponent,
    })
  }
}
