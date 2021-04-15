# react-axios-hoc

[![npm](https://img.shields.io/npm/v/react-axios-hoc.svg)](https://www.npmjs.com/package/react-axios-hoc)

React Higher-Order Component (HOC) for observing and invoking `axios` requests.

Features:
- can rerender component when request status changes
- can abort requests when unmounting component
- can abort request on second call

### Installation

```
npm i react-axios-hoc
```

### Demo

[Demo](https://fakundo.github.io/react-axios-hoc/) 
/ 
[Source](https://github.com/fakundo/react-axios-hoc/tree/master/examples)

### Usage

```js
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import withActions from 'react-axios-hoc'

class Dog extends Component {
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
        <button onClick={this.handleClick}>
          Random Dog
        </button>

        { isPending && (
          <div>
            Loading...
          </div>
        ) }

        { isFailed && (
          <div>
            { error.message }
          </div>
        ) }

        { isSucceded && (
          <div>
            <img src={result.data.message} />
          </div>
        ) }
      </Fragment>
    )
  }
}

const mapActionsToProps = {
  fetchDogAction: cancelToken => () => (
    axios('https://dog.ceo/api/breeds/image/random', {
      cancelToken
    })
  )
}

export default withActions(mapActionsToProps)(Dog)
```

#### Action `run` returns a promise

```js
...

handleClick = async () => {
  const { fetchDogAction } = this.props
  try {
    const dog = await fetchDogAction.run()
    console.log('Fetched dog: ', dog)
  }
  catch (error) {
    console.log('Error occured while fetching a dog: ', error.message)
  }
}

...
```

#### Invoking action with arguments

```js
...

const mapActionsToProps = {
  fetchUserAction: cancelToken => id => (
    axios(`/users/${id}`, { cancelToken })
  )
}

...

fetchUserAction.run({
  params: [userId]
})

...
```

## API

#### HOC creator params

- `mapActionsToProps = { ... }` - function or object that defines actions. If it's a function then component props will be passed to it.
- `options = { abortPendingOnUnmount: true }`

#### Structure of action object

- `isDefault` - `true` if action never ran
- `isPending` - `true` if request is pending
- `isSucceded` - `true` if request has succeded
- `isFailed` - `true` if request has failed
- `result` - result of request
- `error` - error occured while performing request
- `run(runOptions)` - starts request
- `reset(resetOptions)` - resets action (aborts request & resets status)

#### `runOptions`

- `params = []` - params will be passed to axios action
- `silent = false` - disables throwing errors
- `abortPending = true` - aborts previous request if it's still running
- `updateComponent = true` - invokes component rerender on status change
- `updateComponentOnPending = true`
- `updateComponentOnSuccess = true`
- `updateComponentOnFailure = true`

#### `resetOptions`

- `updateComponent = true` - invokes component rerender
