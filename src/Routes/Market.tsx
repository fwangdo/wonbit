import { useQuery } from "@tanstack/react-query"; 
import ApexChart from "react-apexcharts"; 
import { fetchCoins, fetchCoinInfo } from "../api";
import { styled } from "styled-components"; 
import { NumericLiteral } from "typescript";


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

/* To generate table.
*/

const CoinTable = styled.table`

`; 

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

function genCoinTable(symbol: string) {
    const data = fetchCoinInfo(symbol); 
    console.log(data)
    return null;  
};

export function Market() {

    const { isLoading, data } = useQuery<ICoin[]>(
        {
            queryKey: ["allCoins"],
            queryFn: () => fetchCoins()
        }
    );

    const btcData = fetchCoinInfo('btc').then((result) => {
        console.log(result[0]); 
    }); 

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