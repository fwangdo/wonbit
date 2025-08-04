import { useQuery } from "@tanstack/react-query"; 
import ApexChart from "react-apexcharts"; 
import { fetchCoins, fetchCoinHistory, IMarketData  } from "../api";
import { styled } from "styled-components"; 
import { Routes, Route, Link, useParams, Outlet } from "react-router-dom";
import { useEffect, useState } from 'react'; 
import Chart from '../Components/Chart'; 


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
  justify-content: space-between;
`;

// chart part
// const Chart = styled.div`
//     background-color: #000;
// `

// loader.
const Loader = styled.span`
    text-align: center;
    display: block; 
`

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


export function CoinChart() {
    // const { coinId } = useParams<{coinId: string}>(); 
    const coinId = "bitcoin"; 
    const [data, setData] = useState<IMarketData | null>(null); 

    useEffect(() => {
        if (!coinId) return; 

        fetchCoinHistory(coinId).then((result) => {
            setData(result); 
        }).catch((err) => {
            console.error("Error fetching coin data", err); 
        }); 
    }, [coinId]); 
    
    if (!data) return <div>Loading Chart...</div>
    // const res = drawChart(data); 

    return Chart(data);
}

export function Market() {

    const { isLoading, data } = useQuery<ICoinData[]>(
        {
            queryKey: ["allCoins"],
            queryFn: () => fetchCoins(),
            refetchInterval: 60 * 1000 
        }
    );

    /* Requirements of react components are as follows: 
    1. return JSX
    2. start with upper case. 
    3. not async function.  
    */

    return (
        <Container>
            <Outlet />
            { (!data || isLoading) ? (
                <Loader>Loading...</Loader>
            ) : (
                genCoinTable(data.slice(0, 50))
            ) }
        </Container>
    );
}

export default Market; 