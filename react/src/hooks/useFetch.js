/* eslint-disable */
import {useEffect, useState} from "react";
import {ApiBaseUrl} from "../settings";

const useFetch = () => (path, options = {
  method: 'get',
  body: null,
  params: {
    limit: null,
    search: null,
  },
  onSuccess: null,
  onError: null
}) => {
  const [status, setStatus] = useState('loading')
  const [data, setData] = useState(null)

  const params = {}
  Object.assign(params, options.params)

  for (const key in params) {
    if (params[key] === null || params[key] === undefined) delete params[key]
  }

  useEffect(() => {
    fetch(ApiBaseUrl + path + new URLSearchParams(params), {
      method: options.method,
      body: options.body? JSON.stringify(options.body) : null
    })
        .then(res => {
          setStatus(() => 'ok')
          try {
            res.json().then(json => {
              setData(() => {
                if (options.onSuccess) options.onSuccess(json)
                return json
              })
            })
          }
          catch {
            setData(() => {
              if (options.onSuccess) options.onSuccess(data)
              return data
            })
          }
        })
        .catch(reason => {
          setStatus('error')
          if (options.onError) options.onError(reason)
        })
  }, [path])

  return { data, status }
}

export default useFetch