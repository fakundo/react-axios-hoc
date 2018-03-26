import { CancelToken, isCancel } from 'axios'

const DEFAULT = 'DEFAULT'
const PENDING = 'PENDING'
const SUCCEDED = 'SUCCEDED'
const FAILED = 'FAILED'

export default class Action {
  constructor(request, onStatusUpdate) {
    this.request = request
    this.onStatusUpdate = onStatusUpdate
    this.status = DEFAULT
    this.error = undefined
    this.result = undefined
  }

  getState() {
    return {
      isDefault: this.status === DEFAULT,
      isPending: this.status === PENDING,
      isSucceded: this.status === SUCCEDED,
      isFailed: this.status === FAILED,
      result: this.result,
      error: this.error,
      run: this.run,
      reset: this.reset,
    }
  }

  run = async ({
    silent = false,
    updateComponent = true,
    updateComponentOnPending = true,
    updateComponentOnSuccess = true,
    updateComponentOnFailure = true,
  } = {}) => {
    // Cancel pending request
    this.abort()

    // Create new cancel token source
    this.cancelTokenSource = CancelToken.source()

    // Pending
    this.status = PENDING
    this.onStatusUpdate(updateComponentOnPending && updateComponent)

    try {
      // Success
      this.result = await this.request(this.cancelTokenSource.token)
      this.status = SUCCEDED
      this.onStatusUpdate(updateComponentOnSuccess && updateComponent)
    } catch (error) {
      // Ignore axios cancellation error
      if (!isCancel(error)) {
        // Failure
        this.error = error
        this.status = FAILED
        this.onStatusUpdate(updateComponentOnFailure && updateComponent)
        if (!silent) {
          throw error
        }
      }
    }
  }

  abort() {
    if (this.status === PENDING) {
      this.cancelTokenSource.cancel()
    }
  }

  reset() {
    this.abort()
    this.status = DEFAULT
    this.error = undefined
    this.result = undefined
  }
}
