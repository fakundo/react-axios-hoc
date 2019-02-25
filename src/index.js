import { Component, createElement } from 'react'
import { isCancel as isCancelHandler } from 'axios'
import mapValues from 'lodash/mapValues'
import each from 'lodash/each'
import isFunction from 'lodash/isFunction'
import Action from './Action'

export const isCancel = isCancelHandler

export default (
  mapActionsToProps,
  {
    abortPendingOnUnmount = true
  } = {}
) => WrappedComponent =>
  class ReactAxiosHoc extends Component {
    constructor(props) {
      super()

      const actions = isFunction(mapActionsToProps)
        ? mapActionsToProps(props)
        : mapActionsToProps

      this.actions = mapValues(actions, action => (
        new Action(action, this.handleActionUpdate)
      ))

      this.state = this.calculateState()
    }

    componentWillUnmount() {
      each(this.actions, this.performUnmountForAction)
    }

    performUnmountForAction(action) {
      action.updateKey()
      if (abortPendingOnUnmount) {
        action.abort()
      }
    }

    calculateState() {
      return mapValues(
        this.actions,
        action => action.getState()
      )
    }

    handleActionUpdate = (updateComponent) => { // eslint-disable-line
      const nextState = this.calculateState()
      if (updateComponent) {
        this.setState(nextState)
      } else {
        this.state = { ...this.state, ...nextState }
      }
    }

    render() {
      const { axiosHocRef, ...rest } = this.props // eslint-disable-line
      return createElement(WrappedComponent, {
        ...rest,
        ...this.state,
        ref: axiosHocRef,
      })
    }
  }
