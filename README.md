### Action observer

[![npm](https://img.shields.io/npm/v/react-action-observer.svg?maxAge=2592000)](https://www.npmjs.com/package/react-action-observer)

HOC which allows you to observe the status of an asynchronous actions.

### Features

- can rerender component when status has changed
- can abort axios requests on component unmount
- can abort axios request on second call

### Installation
```
yarn add react-action-observer
```

### Usage

```javascript
import axios from 'axios'
import actionObserver from 'react-action-observer'

const fetchGeolocation = cancelToken => axios('http://freegeoip.net/json/', { cancelToken })

@actionObserver
export default class TestComponent extends Component {
  static propTypes = {
    observeAction: PropTypes.func.isRequired,
    getObservedAction: PropTypes.func.isRequired
  }

  async handleClick = () => {
    const { observeAction } = this.props
    const data = await observeAction(cancelToken => fetchGeolocation(cancelToken))
    ...
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
```

### Props

- observeAction(getAction, { key = '', shouldComponentUpdate = true, silent = true } = {})
- getObservedAction(key = '')
