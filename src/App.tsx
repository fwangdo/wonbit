import React from 'react';
import Header from './Components/Header';
import { BrowserRouter as Router, Route, Routes, useMatch } from 'react-router-dom';
import Home from "./Routes/Home"; 
import Wallet from "./Routes/Wallet";
import History from "./Routes/History";
import Support from "./Routes/Support"; 
import Login from "./Routes/Login"; 
import Enroll from "./Routes/Enroll"; 

function Main() {
  const homeMatch = useMatch('/'); 
  const walletMatch = useMatch('/wallet'); 
  const histMatch = useMatch('/history');  
  const supportMatch = useMatch('/support'); 

  return (
      <>
        <Header />
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/wallet" element={<Wallet/>}/>
          <Route path="/history" element={<History/>}/>
          <Route path="/support" element={<Support/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/enroll" element={<Enroll/>}/>
        </Routes>
      </>
  ); 

}

function App() {


  return (
    <Router>
      <Main />
    </Router>
  );
}

export default App;
