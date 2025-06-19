import { useEffect, useState } from "react";
import { BitcoinChart } from "./components/BitcoinChart";
import { PeriodSelector } from "./components/PeriodSelector";
import { StatsCard } from "./components/StatsCard";
import { CustomDatePicker } from "./components/CustomDatePicker";
import type { BitcoinPrice, Stats } from "./types";
import api from "./api";

function App() {
  const [prices, setPrices] = useState<BitcoinPrice[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [customDateRange, setCustomDateRange] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);

  const fetchData = async (
    period?: string,
    startDate?: string,
    endDate?: string,
  ) => {
    try {
      setLoading(true);
      const [pricesResponse, statsResponse] = await Promise.all([
        api.getPrices(period, startDate, endDate),
        api.getStats(period || selectedPeriod),
      ]);

      setPrices(pricesResponse.data);
      setStats(statsResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customDateRange) {
      fetchData(undefined, customDateRange.startDate, customDateRange.endDate);
    } else {
      fetchData(selectedPeriod);
    }
  }, [selectedPeriod, customDateRange]);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setCustomDateRange(null);
  };

  const handleCustomDateRange = (startDate: string, endDate: string) => {
    setCustomDateRange({ startDate, endDate });
    setSelectedPeriod("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Bitcoin Price Tracker
          </h1>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <PeriodSelector
              selectedPeriod={selectedPeriod}
              onPeriodChange={handlePeriodChange}
            />
          </div>
          <div className="flex-1">
            <CustomDatePicker onDateRangeChange={handleCustomDateRange} />
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Current Price"
              value={`$${stats.last.toLocaleString()}`}
              change={stats.changePercent}
              icon="💰"
            />
            <StatsCard
              title="24h High"
              value={`$${stats.max.toLocaleString()}`}
              icon="📈"
            />
            <StatsCard
              title="24h Low"
              value={`$${stats.min.toLocaleString()}`}
              icon="📉"
            />
            <StatsCard
              title="Average"
              value={`$${stats.avg.toLocaleString()}`}
              icon="📊"
            />
          </div>
        )}

        {/* Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Price Chart
          </h2>
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bitcoin-500"></div>
            </div>
          ) : (
            <BitcoinChart data={prices} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
