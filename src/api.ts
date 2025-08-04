const BASE_URL = `https://api.coingecko.com/api/v3`;
const options = {method: 'GET', headers: {accept: 'application/json'}};

export async function fetchCoins() {
    return fetch(`${BASE_URL}/coins/markets/?vs_currency=usd`, options).then((response) => response.json()); 
}

export async function fetchCoinInfo(symbol: string) {
    return fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&symbols=${symbol}`
        , options).then((response) => response.json()); 
}

export async function fetchCoinTickers(coinId: string) {
    return fetch(`${BASE_URL}/tickers/${coinId}`, options).then((response) => response.json()); 
}


// history data. 
function getHistRange(): string[] {
    const today = new Date(); 
    const range = 14; 

    const res = []; 
    for (let i = range - 1; i >= 0; i--) {
        const cur = new Date(today);     
        cur.setDate(today.getDate() - i); 
        const year = cur.getFullYear();
        const month = String(cur.getMonth() + 1);
        const day = String(cur.getDate()); 
        const date = `${day}-${month}-${year}`; 
        res.push(date); 
    }

    return res.reverse();
}; 

export interface IMarketData {
    id: string;     
    name: string; 
    symbol: string; 
    market_data: { 
        current_price: {
            usd: number;
        };
    } 
}; 

export async function fetchCoinHistory(coinId: string): Promise<IMarketData[]> {
    const range = getHistRange(); 
    async function getUrl(date: string) {
        const url = `https://api.coingecko.com/api/v3/coins/${coinId}/history?date=${date}` 
        const response = await fetch(url, options); 
        const data: IMarketData = await response.json(); 
        return data 
    }
    const res = await Promise.all(range.map((date) => getUrl(date))); 
    return res; 
}

export async function fetchCoinDiff(coinId: string) {
    const endDate = Math.floor(Date.now() / 1000); 
    const history = 60 * 60 * 24; 
    const startDate = endDate - history;  
    return fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&symbols=btc'`
        , options
    ).then((response) => response.json())
}