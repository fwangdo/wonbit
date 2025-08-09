export function checkData(data: any) {
    if (data === null || data === undefined) {
        throw new Error(`data -> ${data}`); 
    }

    return data; 
}; 

export default checkData;