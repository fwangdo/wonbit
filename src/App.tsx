import Header from './Components/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./Routes/Home"; 
import Market, { CoinChart, MarketIndexRedirect } from './Routes/Market';
import Wallet from "./Routes/Wallet";
import History from "./Routes/History";
import Support from "./Routes/Support"; 
import Login from "./Routes/Login"; 
import Enroll from "./Routes/Enroll"; 
// import { styled } from "styled-components";

// const ContentWrapper = styled.div`
//   background-color: #f0f0f0;
//   min-height: calc(100vh - 60px);
//   padding: 5px; 
// `

function Container({children}: {children: React.ReactNode}) {
  return (<div className='
    bg-[#f0f0f0]
    min-h-[calc(100vh-60px)]
    p-[5px]
  '>
    {children}
  </div>)
}

function Main() {
  return (
      <>
        <Header />
        <Container>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/market" element={<Market />}>
              <Route index element={<MarketIndexRedirect />} />
              <Route path=":coinId" element={<CoinChart />} />
            </Route>
            <Route path="/wallet" element={<Wallet/>}/>
            <Route path="/history" element={<History/>}/>
            <Route path="/support" element={<Support/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/enroll" element={<Enroll/>}/>
          </Routes>
        </Container>
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
