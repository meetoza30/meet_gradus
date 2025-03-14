import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";

const App = () => {
  <div className="flex flex-col">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
  </div>
};

export default App;
