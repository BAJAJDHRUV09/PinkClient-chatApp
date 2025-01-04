import {Navbar} from "./components/Navbar.jsx";
import { Route,Routes,Navigate } from "react-router-dom";
import {HomePage} from "./pages/HomePage.jsx";
import {SignUpPage} from "./pages/SignUpPage.jsx";
import {LoginPage} from "./pages/LoginPage.jsx";
import {SettingsPage} from "./pages/SettingsPage.jsx";
import {ProfilePage} from "./pages/ProfilePage.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import { useThemeStore } from "./store/useThemeStore.js";
import { useEffect } from "react";
import {Loader} from "lucide-react";
import {Toaster} from "react-hot-toast";
// toast are used for notification like appearances

export const App = () => {

  const {authUser,checkAuth,isCheckingAuth,onlineUsers} = useAuthStore();
  const {theme} = useThemeStore();

  console.log(onlineUsers);

  useEffect(()=>{
    checkAuth()
  },[checkAuth]);

  //setting theme to index.html using setAttribute
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  
  if(isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-9 animate-spin"/>
    </div>
  )

  return (
    <div data-theme= {theme}>

    <Navbar/>

    <Routes>
      <Route path="/" element={ authUser ? <HomePage/> : <Navigate to="/login" /> }/>
      {/* if the user is not authenticated there is no way they can see the home page and if they are there is no they want to see signup and login pages so this is navigation in these three ensures that */}
      <Route path="/signup" element={ !authUser ? <SignUpPage/> : <Navigate to = "/" /> }/>
      <Route path="/login" element={ !authUser ? <LoginPage/> : <Navigate to = "/" />}/>
      <Route path="/settings" element={<SettingsPage/>}/>
      <Route path="/profile" element={authUser? <ProfilePage/>: <Navigate to = "/login"/>}/>
    </Routes>

    <Toaster/>

    </div>
    
  )
}
