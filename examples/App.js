import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import withActions from '../src'

class App extends Component {
  static propTypes = {
    fetchDogAction: PropTypes.object.isRequired,
  }

  handleClick = () => {
    const { fetchDogAction } = this.props
    fetchDogAction.run()
  }

  render() {
    const { fetchDogAction } = this.props
    const { isPending, isFailed, isSucceded, error, result } = fetchDogAction
    return (
      <Fragment>
        <button type="button" onClick={this.handleClick}>
          Random Dog (multiple requests will be aborted)
        </button>

        <hr />

        { isPending && (
          <div style={{ color: 'blue' }}>
            Loading...
          </div>
        ) }

        { isFailed && (
          <div style={{ color: 'red' }}>
            { error.message }
          </div>
        ) }

        { isSucceded && (
          <div>
            <div style={{ color: 'green' }}>
              Succeded!
            </div>
            <img
              alt="random dog"
              src={result.data.message}
            />
          </div>
        ) }
      </Fragment>
    )
  }
}

const mapActionsToProps = {
  fetchDogAction: cancelToken => () => axios('https://dog.ceo/api/breeds/image/random', { cancelToken }),
}

export default withActions(mapActionsToProps)(App)
