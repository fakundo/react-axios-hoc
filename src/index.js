import { Component, createElement } from 'react'
import mapValues from 'lodash/mapValues'
import each from 'lodash/each'
import Action from './Action'

export default mapActionsToProps => WrappedComponent =>
  class ReactAxiosHoc extends Component {
    constructor(props) {
      super()
      const actions = mapActionsToProps(props)

      // Create action instances
      this.actions = mapValues(
        actions,
        action => new Action(action, this.handleStatusUpdate)
      )

      // Set component state
      this.state = this.getActionsState()
    }

    componentWillUnmount() {
      each(
        this.actions,
        action => action.abort()
      )
    }

    getActionsState() {
      return mapValues(
        this.actions,
        action => action.getState()
      )
    }

    handleStatusUpdate = (rerender) => {
      const nextState = this.getActionsState()
      if (rerender) {
        this.setState(nextState)
      } else {
        this.state = nextState
      }
    }

    render() {
      return createElement(WrappedComponent, {
        ...this.props,
        ...this.state,
        ref: this.props.axiosHocRef, // eslint-disable-line
      })
    }
  }
