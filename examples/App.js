import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import actionObserver from '../src'

const fetchGeolocation = cancelToken => axios('http://freegeoip.net/json/', { cancelToken })

@actionObserver
export default class App extends Component {
  static propTypes = {
    observeAction: PropTypes.func.isRequired,
    getObservedAction: PropTypes.func.isRequired
  }

  handleClick = () => {
    const { observeAction } = this.props
    observeAction(cancelToken => fetchGeolocation(cancelToken))
  }

  render() {
    const { getObservedAction } = this.props
    const action = getObservedAction()
    return (
      <div>
        <button onClick={this.handleClick}>
          Fetch location (try click fast to see how multiple requests will be cancelled)
        </button>
        { action.isPending() &&
          <div>Loading ...</div>
        }
        { action.isSucceded() &&
          <pre>{ JSON.stringify(action.getResult().data, null, ' ') }</pre>
        }
      </div>
    )
  }
}
