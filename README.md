# react-axios-hoc

[![npm](https://img.shields.io/npm/v/react-axios-hoc.svg)](https://www.npmjs.com/package/react-axios-hoc)

Observable axios actions for React components. 

Features:
- can rerender component when status of action has changed
- can abort requests on component unmount
- can abort request on second call

## Installation

```
npm install react-axios-hoc
```

## Demo

[Demo](https://fakundo.github.io/react-axios-hoc/) 
/ 
[Source](https://github.com/fakundo/react-axios-hoc/tree/master/examples)

## Usage

```javascript
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import withActions from 'react-axios-hoc'

const mapActionsToProps = {
  fetchDogAction: cancelToken => () => (
    axios('https://dog.ceo/api/breeds/image/random', { cancelToken })
  )
}

export default 
@withActions(mapActionsToProps)
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
```

#### Action is promise

```javascript
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

#### Action with params

```javascript
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

- `mapActionsToProps` - Function or object that defines actions. If it's function then component props will be passed to it as argument.
- `options` - default: `{ abortPendingOnUnmount: true }`

#### Structure of action object

- `isDefault` - `true` if action never ran
- `isPending` - `true` if request is pending
- `isSucceded` - `true` if request has succeded
- `isFailed` - `true` if request has failed
- `result` - result of request
- `error` - error occured while performing request
- `run(options)` - starts request
- `reset(options)` - resets action (aborts request, resets status)

#### Options of method `run`

- `params` default: `[]`, params will be passed to axios action, 
- `silent` - default: `false`, if `true` then error throwing disabled
- `abortPending` - default `true`, aborts previous request if it's still running
- `updateComponent` - default: `true`, invokes component rerender on status change
- `updateComponentOnPending`, default: `true` 
- `updateComponentOnSuccess`, default: `true`
- `updateComponentOnFailure`, default: `true`

#### Options of method `reset`

- `updateComponent` - default: `true`, invokes component rerender
