import React, {} from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";


import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { Sidebar } from "./features/core/sidebar";
import { HomePage } from "./features/home/home-page";
import { CharacterListPage } from "./features/character/character-list-page";
import { PlayerListPage } from "./features/player/player-list-page";

export function App() {

  const darkTheme = createTheme({
    palette: {
      mode: "dark"
    }
  });
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <BrowserRouter>
          <Sidebar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/players" element={<PlayerListPage />} />
              <Route path="/characters" element={<CharacterListPage />} />
            </Routes>
          </main>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
