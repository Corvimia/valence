import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, } from "react-router-dom";

import { Sidebar } from "./components/Sidebar";
import { PlayerPage } from "./components/Pages/PlayerPage";

import './App.css';
import { send } from "./message-control/renderer";
import { createTheme, ThemeProvider } from "@mui/material";

function App() {

  const [text, setText] = useState('');
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <BrowserRouter>
          <Sidebar/>
          <main>
            <header>
              <input value={text} onChange={e => setText(e.target.value)} type="text"/>
              <button onClick={() => send("sql", text).then(_ => console.log(_))}>Send</button>
            </header>
            <Routes>
              <Route path="/" element={<div>home</div>}/>
              <Route path="/players" element={<PlayerPage/>}/>
            </Routes>
          </main>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}


export default App;
