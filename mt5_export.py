import metatrader5 as mt5
import pandas as pd
from datetime import datetime, timedelta
import os

if not mt5.initialize():
    print(f"initialize() failed, error code = {mt5.last_error()}")
    quit()

def get_account_info():
    account_info = mt5.account_info()
    if account_info is None:
        print("Failed to get account info")
        return None
    
    data = {
        "login": [account_info.login],
        "server": [account_info.server],
        "currency": [account_info.currency],
        "balance": [account_info.balance],
        "equity": [account_info.equity],
        "margin": [account_info.margin],
        "free_margin": [account_info.margin_free],
        "profit": [account_info.profit],
        "leverage": [account_info.leverage],
    }
    df = pd.DataFrame(data)
    return df

def get_symbols():
    symbols = mt5.symbols_get()
    data = []
    for symbol in symbols:
        data.append({
            "name": symbol.name,
            "description": symbol.description,
            "point": symbol.point,
            "digits": symbol.digits,
            "spread": symbol.spread,
            "trade_contract_size": symbol.trade_contract_size,
            "volume_min": symbol.volume_min,
            "volume_max": symbol.volume_max,
        })
    df = pd.DataFrame(data)
    return df

def get_symbol_prices(symbol, n=100):
    rates = mt5.copy_rates_from_pos(symbol, mt5.TIMEFRAME_M1, 0, n)
    if rates is None:
        print(f"Failed to get rates for {symbol}")
        return None
    df = pd.DataFrame(rates)
    df['time'] = pd.to_datetime(df['time'], unit='s')
    return df

def get_symbol_prices_timeframe(symbol, timeframe, start, end):
    if timeframe == "M1":
        tf = mt5.TIMEFRAME_M1
    elif timeframe == "M5":
        tf = mt5.TIMEFRAME_M5
    elif timeframe == "M15":
        tf = mt5.TIMEFRAME_M15
    elif timeframe == "M30":
        tf = mt5.TIMEFRAME_M30
    elif timeframe == "H1":
        tf = mt5.TIMEFRAME_H1
    elif timeframe == "H4":
        tf = mt5.TIMEFRAME_H4
    elif timeframe == "D1":
        tf = mt5.TIMEFRAME_D1
    elif timeframe == "W1":
        tf = mt5.TIMEFRAME_W1
    else:
        tf = mt5.TIMEFRAME_M1
    
    rates = mt5.copy_rates_range(symbol, tf, start, end)
    if rates is None:
        print(f"Failed to get rates for {symbol}")
        return None
    df = pd.DataFrame(rates)
    df['time'] = pd.to_datetime(df['time'], unit='s')
    return df

def get_ticks(symbol, start, end):
    ticks = mt5.copy_ticks_range(symbol, start, end, mt5.COPY_TICKS_ALL)
    if ticks is None:
        print(f"Failed to get ticks for {symbol}")
        return None
    df = pd.DataFrame(ticks)
    df['time'] = pd.to_datetime(df['time'], unit='s')
    return df

def get_orders():
    orders = mt5.orders_get()
    if orders is None:
        return pd.DataFrame()
    data = []
    for order in orders:
        data.append({
            "ticket": order.ticket,
            "time": datetime.fromtimestamp(order.time),
            "symbol": order.symbol,
            "volume": order.volume,
            "price": order.price,
            "type": order.type,
            "state": order.state,
            "magic": order.magic,
        })
    df = pd.DataFrame(data)
    return df

def get_positions():
    positions = mt5.positions_get()
    if positions is None:
        return pd.DataFrame()
    data = []
    for pos in positions:
        data.append({
            "ticket": pos.ticket,
            "symbol": pos.symbol,
            "volume": pos.volume,
            "price": pos.price,
            "profit": pos.profit,
            "type": pos.type,
            "time": datetime.fromtimestamp(pos.time),
            "magic": pos.magic,
        })
    df = pd.DataFrame(data)
    return df

def get_deals(start, end):
    deals = mt5.history_deals_get(start, end)
    if deals is None:
        return pd.DataFrame()
    data = []
    for deal in deals:
        data.append({
            "ticket": deal.ticket,
            "time": datetime.fromtimestamp(deal.time),
            "order": deal.order,
            "symbol": deal.symbol,
            "type": deal.type,
            "entry": deal.entry,
            "volume": deal.volume,
            "price": deal.price,
            "profit": deal.profit,
            "commission": deal.commission,
            "magic": deal.magic,
        })
    df = pd.DataFrame(data)
    return df

def export_to_csv(df, filename):
    if df is None or df.empty:
        print(f"No data to export to {filename}")
        return False
    df.to_csv(filename, index=False)
    print(f"Exported to {filename}")
    return True

def main():
    output_dir = "mt5_exports"
    os.makedirs(output_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    print("Exporting account info...")
    account_df = get_account_info()
    export_to_csv(account_df, f"{output_dir}/account_info_{timestamp}.csv")
    
    print("Exporting symbols...")
    symbols_df = get_symbols()
    export_to_csv(symbols_df, f"{output_dir}/symbols_{timestamp}.csv")
    
    print("Exporting orders...")
    orders_df = get_orders()
    export_to_csv(orders_df, f"{output_dir}/orders_{timestamp}.csv")
    
    print("Exporting positions...")
    positions_df = get_positions()
    export_to_csv(positions_df, f"{output_dir}/positions_{timestamp}.csv")
    
    end_time = datetime.now()
    start_time = end_time - timedelta(days=7)
    
    print("Exporting deals history...")
    deals_df = get_deals(start_time, end_time)
    export_to_csv(deals_df, f"{output_dir}/deals_{timestamp}.csv")
    
    symbols_to_export = ["EURUSD", "GBPUSD", "USDJPY"]
    for symbol in symbols_to_export:
        if mt5.symbol_select(symbol, True):
            print(f"Exporting {symbol} M1 prices...")
            prices_df = get_symbol_prices(symbol, 1000)
            export_to_csv(prices_df, f"{output_dir}/{symbol}_M1_{timestamp}.csv")
            
            print(f"Exporting {symbol} H1 prices...")
            prices_h1 = get_symbol_prices_timeframe(symbol, "H1", start_time, end_time)
            export_to_csv(prices_h1, f"{output_dir}/{symbol}_H1_{timestamp}.csv")
    
    mt5.shutdown()
    print("Export complete!")

if __name__ == "__main__":
    main()
