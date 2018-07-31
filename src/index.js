import { Component, createElement } from 'react'
import mapValues from 'lodash/mapValues'
import each from 'lodash/each'
import Action from './Action'

export default mapActionsToProps => WrappedComponent =>
  class ReactAxiosHoc extends Component {
    constructor(props) {
      super()
      this.actions = mapValues(
        mapActionsToProps(props),
        action => new Action(action, this.handleActionUpdate)
      )
      this.state = this.calculateState()
    }

    componentWillUnmount() {
      this.unmounted = true
      each(
        this.actions,
        action => action.abort()
      )
    }

    calculateState() {
      return mapValues(
        this.actions,
        action => action.getState()
      )
    }

    handleActionUpdate = (updateComponent) => {
      if (this.unmounted) return
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
