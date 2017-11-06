const DEFAULT = 'DEFAULT'
const PENDING = 'PENDING'
const SUCCEDED = 'SUCCEDED'
const FAILED = 'FAILED'

export default class ObservedAction {
  constructor(action, cancelTokenSource) {
    this.status = action ? PENDING : DEFAULT
    this.action = action
    this.cancelTokenSource = cancelTokenSource
    this.error = null
    this.result = null
  }

  resolve(result) {
    this.status = SUCCEDED
    this.result = result
  }

  reject(error) {
    this.status = FAILED
    this.error = error
  }

  abort() {
    if (this.action && this.cancelTokenSource) {
      this.cancelTokenSource.cancel()
    }
  }

  reset() {
    this.status = DEFAULT
    this.error = null
    this.result = null
  }

  isDefault() {
    return this.status === DEFAULT
  }

  isPending() {
    return this.status === PENDING
  }

  isSucceded() {
    return this.status === SUCCEDED
  }

  isFailed() {
    return this.status === FAILED
  }

  getError() {
    return this.error
  }

  getResult() {
    return this.result
  }

  getErrorMessage() {
    return this.error && this.error.message
  }
}
