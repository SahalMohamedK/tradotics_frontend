export const ERROR = {
    NO_TRADE: 0,
    NO_TRADE_HISTORIES: 1
}

export function noTradeError(err){
    try{
        return err.code == 'ERR_BAD_REQUEST' && err.response.data.code == ERROR.NO_TRADE
    } catch {
        return false
    }
}

export function noTradeHistoriesError(err){
    try{
        return err.code == 'ERR_BAD_REQUEST' && err.response.data.code == ERROR.NO_TRADE_HISTORIES
    }catch{
        return False
    }
}

export function networkError(err){
    return err.code === "ERR_NETWORK"
}