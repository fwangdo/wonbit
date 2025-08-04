import { useQuery } from "@tanstack/react-query"; 
import ApexChart from "react-apexcharts"; 
import { fetchCoins, fetchCoinInfo } from "../api";
import { styled } from "styled-components"; 
import { BrowserRouter as Router, Route, Link, BrowserRouter } from "react-router-dom";


interface IHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

interface ChartProps {
  coinId: string;
}

const Container = styled.div`
  padding: 10px 20px;
  margin: 0;
  display: flex;
  justify-content: flex-end;
`;

const Loader = styled.span`
    text-align: center;
    display: block; 
`

const Coin = styled.li`
    background-color: white;
    border-radius: 15px; 
    margin-bottom: 10px;
    list-style: none;
`;

/* To generate table.
*/

const CoinTable = styled.table`
    /* padding: 30px; // top right bottom left */
    width: auto;
    border-collapse: collapse;
`; 

const Thead = styled.thead`
    background-color: #f5f5f5;
`;

const Th = styled.th`
    padding: 10px;
    border: 1px solid #ffffff;
    text-align: left;
    font-size: 13px;
    ` 

const TdBase = styled.td`
    padding: 8px;
    border: 0.5px solid #ddd; 
    font-size: 15px;
    background-color: #ffffff;
`; 

const TdName = styled(TdBase)`
    display: flex;
    text-align: left;
`

const TdElem = styled(TdBase)`
    text-align: right;
`

const Td = styled.td`
    padding: 10px;
    border: 1px solid #ddd; 
    font-size: 15px;
`; 

const Tr = styled.tr`
`

interface ICoinData {
    // current_price: 114293
    // high_24h: 114637
    // id: "bitcoin"
    // image: "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400"
    // low_24h: 112125
    // name: "Bitcoin"
    // price_change_24h: 2167.72
    // price_change_percentage_24h: 1.9333
    // symbol: "btc"

    current_price: number; 
    high_24h: number;
    id: string;
    image: string;
    low_24h: number; 
    name: string;
    price_change_24h: number; 
    price_change_percentage_24h: number; 
    symbol: string; 
}; 

function genCoinTable(data: ICoinData[]) {
    return (
        <CoinTable>
            <Thead>
                <Tr>
                    <Th>Name</Th>
                    <Th>Price</Th>
                    <Th>Updates</Th>
                </Tr> 
            </Thead>
            <tbody>
                {data.map((coin) =>(
                    <Tr key={coin.symbol}>
                        <TdName>{coin.symbol}</TdName>
                        <TdElem>{coin.current_price}</TdElem>
                        <TdElem>{coin.price_change_percentage_24h}</TdElem>
                    </Tr>
                ))}
            </tbody>
        </CoinTable>
    );
};

function genCoinChart(id: string) {
    return null;
}

export function Market() {

    const { isLoading, data } = useQuery<ICoinData[]>(
        {
            queryKey: ["allCoins"],
            queryFn: () => fetchCoins(),
            refetchInterval: 60 * 1000 
        }
    );

    return (
        <BrowserRouter>
            <Router>
                <Route path=":coinId" />
            </Router>
            <Container>
                { (!data || isLoading) ? (
                    <Loader>Loading...</Loader>
                ) : (
                    genCoinTable(data.slice(0, 50))
                ) }
            </Container>
        </BrowserRouter>
    );
}

export default Market; 