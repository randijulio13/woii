import UserContext from './contexts/UserContext'
import useAuthListener from './hooks/useAuthListener'
import Routers from './routers'

function App() {
  const { user, setUser } = useAuthListener()

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Routers />
    </ UserContext.Provider>
  )
}

export default App
