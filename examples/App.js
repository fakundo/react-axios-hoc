import React, { useCallback } from 'react'
import axios from 'axios'
import withActions from 'react-axios-hoc'

const App = ({ fetchDogAction }) => {
  const { isPending, isFailed, isSucceded, error, result } = fetchDogAction

  const handleClick = useCallback(() => {
    fetchDogAction.run()
  }, [fetchDogAction])

  return (
    <>
      <button type="button" onClick={handleClick}>
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
    </>
  )
}

const mapActionsToProps = {
  fetchDogAction: (cancelToken) => () => axios('https://dog.ceo/api/breeds/image/random', { cancelToken }),
}

export default withActions(mapActionsToProps)(App)
