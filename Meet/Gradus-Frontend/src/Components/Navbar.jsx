import React from "react";
import logo from '../assets/gradus_logo-rbg.png'

const Navbar = ()=>{
    return(
        <div className="navbar bg-base-100 border-b-2 justify-between border-green-300 shadow-sm">
        <div className="">
          <img src={logo} className=" h-10 "></img>
        </div>
        
          <input type="text" placeholder="Search for topics" className="input input-bordered w-50 md:w-auto" />
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-7 w-52 p-2 shadow">
              <li>
                <a className="justify-between">
                  Profile
                </a>
              </li>
              <li><a>Revise</a></li>
              <li><a>Logout</a></li>
              
            </ul>
          </div>
        </div>
      </div>
    )
}

export default Navbar;