const BASE_URL = `https://api.coingecko.com/api/v3`;
const options = {method: 'GET', headers: {accept: 'application/json'}};

export async function fetchCoins() {
    return fetch(`${BASE_URL}/coins/list`, options).then((response) => response.json()); 
}

export async function fetchCoinInfo(coinId: string) {
    return fetch(`${BASE_URL}/coins/${coinId}`, options).then((response) => response.json()); 
}

export async function fetchCoinTickers(coinId: string) {
    return fetch(`${BASE_URL}/tickers/${coinId}`, options).then((response) => response.json()); 
}

export async function fetchCoinHistory(coinId: string) {
    const endDate = Math.floor(Date.now() / 1000); 
    const history = 60 * 60 * 24 * 7 * 2; 
    const startDate = endDate - history;  
    return fetch(
        `${BASE_URL}/coins/${coinId}/ohlcv/historical?start=${startDate}&end=${endDate}`
        , options
    ).then((response) => response.json())
}

export async function fetchCoinDiff(coinId: string) {
    const endDate = Math.floor(Date.now() / 1000); 
    const history = 60 * 60 * 24; 
    const startDate = endDate - history;  
    return fetch(
        // `${BASE_URL}/coins/${coinId}/ohlcv/historical?start=${startDate}&end=${endDate}`
        `https://ohlcv-api.nomadcoders.workers.dev?coinId=${coinId}`
        , options
    ).then((response) => response.json())
}