import { useQuery } from "@tanstack/react-query"; 
import ApexChart from "react-apexcharts"; 
import { fetchCoins, fetchCoinHistory } from "../api";
import { styled } from "styled-components"; 
import { createFunctionDeclaration } from "typescript";


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

interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}


const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Loader = styled.span`
    text-align: center;
    display: block; 
`

const CoinList = styled.ul``; 

const Coin = styled.li`
    background-color: white;
    border-radius: 15px; 
    margin-bottom: 10px;
    list-style: none;
`;

export function Market() {

    const { isLoading, data } = useQuery<ICoin[]>(
        {
            queryKey: ["allCoins"],
            queryFn: () => fetchCoins()
        }
    );

    return (
        <Container>
            { isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <CoinList>
                    {data?.slice(0, 100).map((coin) => (
                        <Coin key={coin.id}>
                            {coin.id}
                        </Coin>
                    ))}
                </CoinList>
            ) }
        </Container>
    );
}

export default Market; 