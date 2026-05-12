#property script_show_inputs

input string SymbolList = "EURUSD,GBPUSD,USDJPY";
input int BarsToExport = 1000;
input ENUM_TIMEFRAMES Timeframe = PERIOD_H1;

string TimeframeToString(ENUM_TIMEFRAMES tf)
{
   switch(tf)
   {
      case PERIOD_M1:  return "M1";
      case PERIOD_M5:  return "M5";
      case PERIOD_M15: return "M15";
      case PERIOD_M30: return "M30";
      case PERIOD_H1:  return "H1";
      case PERIOD_H4:  return "H4";
      case PERIOD_D1:  return "D1";
      case PERIOD_W1:  return "W1";
      case PERIOD_MN1: return "MN1";
   }
   return "Unknown";
}

string GetCSVFolder()
{
   string terminalPath = TerminalInfoString(TERMINAL_DATA_PATH);
   string csvFolder = terminalPath + "\\MQL5\\Files\\CSV_Export";
   
   if(!FolderCreate(csvFolder))
   {
      Print("Failed to create folder: ", GetLastError());
      return "";
   }
   return csvFolder;
}

void ExportAccountInfo(string folder)
{
   string filename = folder + "\\account_info.csv";
   int handle = FileOpen(filename, FILE_CSV|FILE_WRITE, ',');
   
   if(handle == INVALID_HANDLE)
   {
      Print("Failed to open account info file: ", GetLastError());
      return;
   }
   
   FileWrite(handle, "Login,Server,Currency,Balance,Equity,Margin,FreeMargin,Profit,Leverage");
   FileWrite(handle, 
      AccountInfoInteger(ACCOUNT_LOGIN), 
      AccountInfoString(ACCOUNT_SERVER),
      AccountInfoString(ACCOUNT_CURRENCY),
      DoubleToString(AccountInfoDouble(ACCOUNT_BALANCE), 2),
      DoubleToString(AccountInfoDouble(ACCOUNT_EQUITY), 2),
      DoubleToString(AccountInfoDouble(ACCOUNT_MARGIN), 2),
      DoubleToString(AccountInfoDouble(ACCOUNT_MARGIN_FREE), 2),
      DoubleToString(AccountInfoDouble(ACCOUNT_PROFIT), 2),
      AccountInfoInteger(ACCOUNT_LEVERAGE)
   );
   
   FileClose(handle);
   Print("Account info exported to: ", filename);
}

void ExportSymbols(string folder, string symbols[])
{
   string filename = folder + "\\symbols.csv";
   int handle = FileOpen(filename, FILE_CSV|FILE_WRITE, ',');
   
   if(handle == INVALID_HANDLE)
   {
      Print("Failed to open symbols file: ", GetLastError());
      return;
   }
   
   FileWrite(handle, "Name,Description,Digits,Point,Spread,TradeContractSize,VolumeMin,VolumeMax");
   
   for(int i = 0; i < ArraySize(symbols); i++)
   {
      string sym = symbols[i];
      if(SymbolSelect(sym, true))
      {
         FileWrite(handle,
            sym,
            SymbolInfoString(sym, SYMBOL_DESCRIPTION),
            (int)SymbolInfoInteger(sym, SYMBOL_DIGITS),
            DoubleToString(SymbolInfoDouble(sym, SYMBOL_POINT), 5),
            (int)SymbolInfoInteger(sym, SYMBOL_SPREAD),
            DoubleToString(SymbolInfoDouble(sym, SYMBOL_TRADE_CONTRACT_SIZE), 2),
            DoubleToString(SymbolInfoDouble(sym, SYMBOL_VOLUME_MIN), 2),
            DoubleToString(SymbolInfoDouble(sym, SYMBOL_VOLUME_MAX), 2)
         );
      }
   }
   
   FileClose(handle);
   Print("Symbols exported to: ", filename);
}

void ExportOHLC(string folder, string symbol, ENUM_TIMEFRAMES tf)
{
   string filename = folder + "\\" + symbol + "_" + TimeframeToString(tf) + ".csv";
   int handle = FileOpen(filename, FILE_CSV|FILE_WRITE, ',');
   
   if(handle == INVALID_HANDLE)
   {
      Print("Failed to open OHLC file for ", symbol, ": ", GetLastError());
      return;
   }
   
   FileWrite(handle, "Time,Open,High,Low,Close,Volume");
   
   int bars = Bars(symbol, tf);
   int count = MathMin(bars, BarsToExport);
   
   for(int i = 0; i < count; i++)
   {
      datetime time = iTime(symbol, tf, i);
      double open = iOpen(symbol, tf, i);
      double high = iHigh(symbol, tf, i);
      double low = iLow(symbol, tf, i);
      double close = iClose(symbol, tf, i);
      long volume = (long)iVolume(symbol, tf, i);
      
      FileWrite(handle, 
         TimeToString(time, TIME_DATE|TIME_MINUTES),
         DoubleToString(open, 5),
         DoubleToString(high, 5),
         DoubleToString(low, 5),
         DoubleToString(close, 5),
         volume
      );
   }
   
   FileClose(handle);
   Print(symbol, " ", TimeframeToString(tf), " exported (", count, " bars) to: ", filename);
}

void ExportOrders(string folder)
{
   string filename = folder + "\\orders.csv";
   int handle = FileOpen(filename, FILE_CSV|FILE_WRITE, ',');
   
   if(handle == INVALID_HANDLE)
   {
      Print("Failed to open orders file: ", GetLastError());
      return;
   }
   
   FileWrite(handle, "Ticket,Symbol,Type,Volume,Price,OpenTime,Magic");
   
   int total = OrdersTotal();
   for(int i = 0; i < total; i++)
   {
      ulong ticket = OrderGetTicket(i);
      if(ticket > 0)
      {
         FileWrite(handle,
            ticket,
            OrderGetString(ORDER_SYMBOL),
            EnumToString(OrderGetInteger(ORDER_TYPE)),
            DoubleToString(OrderGetDouble(ORDER_LOTS), 2),
            DoubleToString(OrderGetDouble(ORDER_PRICE), 5),
            TimeToString(OrderGetInteger(ORDER_TIME_SETUP), TIME_DATE|TIME_MINUTES),
            OrderGetInteger(ORDER_MAGIC)
         );
      }
   }
   
   FileClose(handle);
   Print("Orders exported to: ", filename);
}

void ExportPositions(string folder)
{
   string filename = folder + "\\positions.csv";
   int handle = FileOpen(filename, FILE_CSV|FILE_WRITE, ',');
   
   if(handle == INVALID_HANDLE)
   {
      Print("Failed to open positions file: ", GetLastError());
      return;
   }
   
   FileWrite(handle, "Ticket,Symbol,Type,Volume,Price,Profit,OpenTime,Magic");
   
   int total = PositionsTotal();
   for(int i = 0; i < total; i++)
   {
      ulong ticket = PositionGetTicket(i);
      if(ticket > 0 && PositionSelectByTicket(ticket))
      {
         FileWrite(handle,
            ticket,
            PositionGetString(POSITION_SYMBOL),
            EnumToString(PositionGetInteger(POSITION_TYPE)),
            DoubleToString(PositionGetDouble(POSITION_VOLUME), 2),
            DoubleToString(PositionGetDouble(POSITION_PRICE_OPEN), 5),
            DoubleToString(PositionGetDouble(POSITION_PROFIT), 2),
            TimeToString(PositionGetInteger(POSITION_TIME), TIME_DATE|TIME_MINUTES),
            PositionGetInteger(POSITION_MAGIC)
         );
      }
   }
   
   FileClose(handle);
   Print("Positions exported to: ", filename);
}

void ExportDealsHistory(string folder, datetime startTime, datetime endTime)
{
   string filename = folder + "\\deals_history.csv";
   int handle = FileOpen(filename, FILE_CSV|FILE_WRITE, ',');
   
   if(handle == INVALID_HANDLE)
   {
      Print("Failed to open deals file: ", GetLastError());
      return;
   }
   
   FileWrite(handle, "Ticket,Order,Symbol,Type,Entry,Volume,Price,Profit,Commission,CloseTime,Magic");
   
   if(!HistorySelect(startTime, endTime))
   {
      Print("Failed to select history: ", GetLastError());
      FileClose(handle);
      return;
   }
   
   uint deals = HistoryDealsTotal();
   
   for(uint i = 0; i < deals; i++)
   {
      ulong ticket = HistoryDealGetTicket(i);
      if(ticket > 0)
      {
         FileWrite(handle,
            ticket,
            HistoryDealGetInteger(ticket, DEAL_ORDER),
            HistoryDealGetString(ticket, DEAL_SYMBOL),
            EnumToString((ENUM_DEAL_TYPE)HistoryDealGetInteger(ticket, DEAL_TYPE)),
            EnumToString((ENUM_DEAL_ENTRY)HistoryDealGetInteger(ticket, DEAL_ENTRY)),
            DoubleToString(HistoryDealGetDouble(ticket, DEAL_VOLUME), 2),
            DoubleToString(HistoryDealGetDouble(ticket, DEAL_PRICE), 5),
            DoubleToString(HistoryDealGetDouble(ticket, DEAL_PROFIT), 2),
            DoubleToString(HistoryDealGetDouble(ticket, DEAL_COMMISSION), 2),
            TimeToString(HistoryDealGetInteger(ticket, DEAL_TIME), TIME_DATE|TIME_MINUTES),
            HistoryDealGetInteger(ticket, DEAL_MAGIC)
         );
      }
   }
   
   FileClose(handle);
   Print("Deals history exported (", deals, " deals) to: ", filename);
}

string[] ParseSymbols(string input)
{
   string result[];
   ushort separator = StringGetCharacter(",", 0);
   
   string temp = StringReplace(input, " ", "");
   int count = StringSplit(temp, separator, result);
   
   return result;
}

void OnStart()
{
   Print("=== MT5 Data Export Script ===");
   
   string folder = GetCSVFolder();
   if(folder == "")
   {
      Print("Failed to create export folder");
      return;
   }
   
   Print("Export folder: ", folder);
   
   ExportAccountInfo(folder);
   
   string symbols[] = ParseSymbols(SymbolList);
   ExportSymbols(folder, symbols);
   
   for(int i = 0; i < ArraySize(symbols); i++)
   {
      string sym = symbols[i];
      if(SymbolSelect(sym, true))
      {
         ExportOHLC(folder, sym, Timeframe);
      }
      else
      {
         Print("Cannot select symbol: ", sym);
      }
   }
   
   ExportOrders(folder);
   ExportPositions(folder);
   
   datetime endTime = TimeCurrent();
   datetime startTime = endTime - 30 * 24 * 60 * 60;
   ExportDealsHistory(folder, startTime, endTime);
   
   Print("=== Export Complete ===");
}
