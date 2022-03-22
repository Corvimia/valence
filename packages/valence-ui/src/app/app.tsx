import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Sidebar } from "./components/Sidebar";
import { PlayerPage } from "./components/Pages/PlayerPage";

import './App.css';
import { createTheme, ThemeProvider } from "@mui/material";
import { CharacterPage } from "./components/Pages/CharacterPage";
import { HomePage } from "./components/Pages/HomePage";

export function App() {

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
              Debug Panel:
              <br/>
              <input value={text} onChange={e => setText(e.target.value)} type="text"/>
              <button onClick={() => console.log(text)}>Send</button>
            </header>

            <Routes>
              <Route path="/" element={<HomePage/>}/>
              <Route path="/players" element={<PlayerPage/>}/>
              <Route path="/characters" element={<CharacterPage/>}/>
            </Routes>
          </main>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
