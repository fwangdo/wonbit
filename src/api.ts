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


export interface IMarketData {
    prices: Array<Array<number>[]>[]; 
}; 

export type ICandleData = number[][]; 

async function getUrl<T>(url: string): Promise<T> {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
    }
    const data: T = await response.json();
    return data;
}

export async function fetchCoinHistory(coinId: string): Promise<IMarketData> {
    async function getUrl() {
        const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=90`;
        const response = await fetch(url, options); 
        const data: IMarketData = await response.json(); 
        return data 
    }
    const res = await getUrl(); 
    return res; 
}

export async function fetchCoinCandle(coinId: string): Promise<ICandleData> {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=1`; 
    const res: ICandleData = await getUrl(url); 
    return res; 
}

interface ICurPrice {
    market_data: {
        current_price: {
            usd: number;
        }
    }
}

export async function fetchCurPrice(coinId: string): Promise<ICurPrice> {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}`;
    const res: ICurPrice = await getUrl(url); 
    return res; 
}