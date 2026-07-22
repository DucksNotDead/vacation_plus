const apiBaseUrl = "http://localhost:8080"
const api = (path: string, method: "get"|"post"|"put"|"delete" = "get", body: any = null) => {
  const token = window.localStorage.getItem("accessToken")
  return new Promise<any>(resolve => {
    fetch(apiBaseUrl + path, {
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      method,
      body: body ? JSON.stringify(body) : null
    }).then(async result => {
      if (!result.ok) resolve(null)
      else {
        try {
          resolve(await result.json())
        }
        catch (e) {
          resolve(true)
        }
      }
    })
  })
}

export default api;