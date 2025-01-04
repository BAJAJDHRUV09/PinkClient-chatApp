import { useAuthStore } from "../store/useAuthStore.js";
import {BotMessageSquare,Settings,User,LogOut,Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const {logout, authUser, isLoggingOut} = useAuthStore();
  
  return (
    <div>

      <header className="bg-base-100 border-b border-base-300 relative w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">

        
        <div className="container mx-auto px-4 h-16">

          {/* this is the left side part just logo and name of website */}
          <div className="flex items-center justify-between h-full">

            {/* no first comes my logo which we will import from lucide-react */}
            <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <BotMessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">PinkClient</h1>
            </Link>
            </div>

          

            {/* this is the right side part everything we want */}
            <div className="flex items-center gap-2">

              {/* this is the link to settings and we'll be shown to all users authenticated and non authenticated users.*/}
              <Link
                to={"/settings"}
                className={`btn btn-sm gap-2 transition-colors`}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>

              {authUser && (
                <>
                  <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                    <User className="size-5" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>

                  <button className="flex gap-2 items-center" onClick={logout} disabled={isLoggingOut}>
                    {
                      isLoggingOut ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        Loading...
                      </>
                      ) : (
                        <>
                        <LogOut className="size-5" />
                     <span className="hidden sm:inline">Logout</span>
                     </>
                      )
                    }
                  </button>
                  
                </>
              )}

            </div>      
          </div>

        </div>

      </header>

    </div>
  )
}
