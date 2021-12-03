import React from 'react';
import { BrowserRouter, Link, Route, Routes, } from "react-router-dom";

import './App.css';


function App() {
  return (
    <>
      <BrowserRouter>
        <header>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="about">About</Link>
            </li>
          </ul>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<div>home</div>}/>
            <Route path="/about" element={<div>about</div>}/>
          </Routes>
        </main>
      </BrowserRouter>
    </>
  );
}


export default App;
