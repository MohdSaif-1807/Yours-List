import { Route, Routes } from 'react-router-dom';
import './App.css';
import { LoginSignup } from './Components/LoginSignup';
import { Dashboard } from './Components/Dashboard';
import { AppContext } from './AppContext';
import { useCookies } from 'react-cookie';

export const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const baseBackendRoute = "http://localhost:5000";

  return (
    <>
      <AppContext.Provider value={{ cookies, setCookie, removeCookie, baseBackendRoute }}>
        <Routes>
          <Route path='/' element={<LoginSignup />}></Route>
          <Route path='/home' element={<Dashboard />}></Route>
        </Routes>
      </AppContext.Provider>
    </>
  )
}