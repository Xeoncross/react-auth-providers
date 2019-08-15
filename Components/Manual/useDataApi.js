import { useState, useEffect, useReducer } from 'react'
import axios from 'axios'
import { useToken } from './TokenContext'

// Taken from https://github.com/the-road-to-learn-react/use-data-api/
// and modified with several differences:
// 1. supports empty itnitalUrl (no-op)
// 2. sends auth token on each request
// 3. support alternative HTTP methods (and payloads)

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, isLoading: true, error: false }
    case 'FETCH_SUCCESS':
      return {
        isLoading: false,
        error: false,
        data: action.payload
      }
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    default:
      throw new Error('Invalid Data API Action')
  }
}

const useDataApi = (method, initialUrl, requestData, initialData) => {
  const [url, setUrl] = useState(initialUrl)
  const { token } = useToken()

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    error: false,
    data: initialData
  })

  useEffect(() => {
    let didCancel = false

    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' })

      try {
        const result = await axios({
          // baseURL: process.env.REACT_APP_API_ENDPOINT!,
          method,
          url,
          data: requestData,
          timeout: 4000,
          headers: {
            common: {
              'Content-Type': 'application/json',
              Authorization: token && `Bearer ${token}`
            }
          }
        })

        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
        }
      } catch (error) {
        // https://github.com/axios/axios#handling-errors
        let payload = error.message
        if (error.response) {
          payload = error.response.data
        }

        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE', payload })
        }
      }
    }

    if (url) {
      fetchData()
    }

    return () => {
      // TODO support https://github.com/axios/axios#cancellation
      didCancel = true
    }
  }, [url, initialUrl, requestData, token, method])

  return [state, setUrl]
}

export default useDataApi
