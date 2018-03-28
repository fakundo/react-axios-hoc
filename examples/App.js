import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import withActions from '../src'

@withActions(() => ({
  fetchGeolocationAction: cancelToken => () => axios('http://freegeoip.net/json/', { cancelToken }),
}))
export default class App extends PureComponent {
  static propTypes = {
    fetchGeolocationAction: PropTypes.object.isRequired,
  }

  handleClick = () => {
    const { fetchGeolocationAction } = this.props
    fetchGeolocationAction.run()
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>
          Fetch location (try click fast to see how multiple requests will be cancelled)
        </button>
        <pre>{ JSON.stringify(this.props, null, ' ') }</pre>
      </div>
    )
  }
}
