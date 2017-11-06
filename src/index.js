import { Component, createElement } from 'react'
import PropTypes from 'prop-types'
import assign from 'lodash/assign'
import uniqueId from 'lodash/uniqueId'
import each from 'lodash/each'
import { CancelToken } from 'axios'
import isObject from 'lodash/isObject'
import ObservedAction from './ObservedAction'

export const propTypes = {
  observeAction: PropTypes.func,
  getObservedAction: PropTypes.func,
  actionObserverKey: PropTypes.any,
  actionObserverRef: PropTypes.func
}

export default WrappedComponent =>
  class AsyncObserverDecorator extends Component {
    static propTypes = {
      actionObserverRef: PropTypes.func
    }

    static defaultProps = {
      actionObserverRef: () => {}
    }

    constructor() {
      super()
      this.observableActions = {}
      this.state = { actionObserverKey: undefined }
      this.mounted = false
    }

    componentDidMount() {
      this.mounted = true
    }

    componentWillUnmount() {
      each(this.observableActions, oR => oR.abort())
      this.mounted = false
    }

    getObservedAction = (key = '') => {
      return this.observableActions[key] || new ObservedAction()
    }

    observeAction = async (getAction, { key = '', shouldComponentUpdate = true } = {}) => {
      // Cancel existing action with same key
      this.getObservedAction(key).abort()

      // Get action
      const cancelTokenSource = CancelToken.source()
      const action = getAction(cancelTokenSource.token)

      // Create new observation
      const observedAction = new ObservedAction(action, cancelTokenSource)
      this.observableActions[key] = observedAction

      // Update component on pending
      this.updateComponentIfNeeded(shouldComponentUpdate, 'pending')

      try {
        const data = await action
        observedAction.resolve(data)
        this.updateComponentIfNeeded(shouldComponentUpdate, 'success')
        return data
      } catch (error) {
        observedAction.reject(error)
        this.updateComponentIfNeeded(shouldComponentUpdate, 'failure')
        throw error
      }
    }

    updateComponentIfNeeded(shouldComponentUpdate, phase) {
      const scu = isObject(shouldComponentUpdate) ?
        assign({
          pending: true,
          success: true,
          failure: true,
        }, shouldComponentUpdate) :
        shouldComponentUpdate

      if (scu === true || (isObject(scu) && scu[phase])) {
        this.updateComponent()
      }
    }

    updateComponent() {
      if (this.mounted) {
        this.setState({ actionObserverKey: uniqueId('actionObserverKey') })
      }
    }

    render() {
      const { actionObserverRef } = this.props
      const { actionObserverKey } = this.state
      return createElement(WrappedComponent, {
        ...this.props,
        observeAction: this.observeAction,
        getObservedAction: this.getObservedAction,
        ref: actionObserverRef,
        actionObserverKey
      })
    }
  }
