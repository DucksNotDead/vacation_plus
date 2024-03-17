import useCurrentUser from "../useCurrentUser";
import useFetch from "../useFetch";

const useAccounts = () => {
  const fetcher = useFetch()
  const { user: currentUser } = useCurrentUser()
  const departmentId = currentUser.department.id
  const path = '/users/'/*+departmentId*/

  const getAll = (limit=null, search=null) => {
    return fetcher(path, { params: { limit, search } })
  }

  const get = (id) => {
    return fetcher(path+"/"+id)
  }

  return { get, getAll }
}

export default useAccounts