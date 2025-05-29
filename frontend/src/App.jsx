import React, { useState, useEffect } from 'react';
import {Header} from './components/Header';
import Home from './pages/Home';
import './App.css'

function App() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-500">
      <Header/>
      <Home />
    </div>
  );
}

export default App;