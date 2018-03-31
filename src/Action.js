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
  }

  getState = () => {
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
    params = [],
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
      const request = this.createRequest(this.cancelTokenSource.token)
      this.result = await request(...params)
      this.status = SUCCEDED
      this.onStatusUpdate(updateComponentOnSuccess && updateComponent)
    } catch (error) {
      if (isCancel(error)) {
        // Request cancelled
        this.error = undefined
        this.status = DEFAULT
      } else {
        // Failure
        this.error = error
        this.status = FAILED
      }
      this.onStatusUpdate(updateComponentOnFailure && updateComponent)
      if (!silent) throw error
    }

    // Return promise result
    return this.result
  }

  abort = () => {
    if (this.status === PENDING) {
      this.cancelTokenSource.cancel()
    }
  }

  reset = ({
    updateComponent = true
  } = {}) => {
    this.abort()
    this.status = DEFAULT
    this.error = undefined
    this.result = undefined
    this.onStatusUpdate(updateComponent)
  }
}
