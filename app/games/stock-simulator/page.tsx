"use client";
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StockMarketSimulator = () => {
  // Game state
  const [cash, setCash] = useState(10000);
  const [portfolio, setPortfolio] = useState({});
  const [stocks, setStocks] = useState([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [maxDays, setMaxDays] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [newsEvents, setNewsEvents] = useState([]);
  const [showTutorial, setShowTutorial] = useState(true);
  const [buyAmount, setBuyAmount] = useState({});
  const [sellAmount, setSellAmount] = useState({});
  const [historicalData, setHistoricalData] = useState({});
  const [selectedStock, setSelectedStock] = useState(null);
  
  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Create initial stocks with realistic attributes
    const initialStocks = [
      { 
        id: 1, 
        name: "TechFuture", 
        symbol: "TFT", 
        price: 150, 
        volatility: 0.03, 
        industry: "Technology",
        trend: 0.001,
        description: "A cutting-edge tech company focusing on AI and machine learning."
      },
      { 
        id: 2, 
        name: "GreenEnergy", 
        symbol: "GRN", 
        price: 75, 
        volatility: 0.025, 
        industry: "Energy",
        trend: 0.0015,
        description: "Renewable energy provider with global operations."
      },
      { 
        id: 3, 
        name: "HealthPlus", 
        symbol: "HLP", 
        price: 210, 
        volatility: 0.02, 
        industry: "Healthcare",
        trend: 0.0005,
        description: "Leading healthcare provider with innovative medical solutions."
      },
      { 
        id: 4, 
        name: "ConsumerGoods", 
        symbol: "CGD", 
        price: 45, 
        volatility: 0.015, 
        industry: "Retail",
        trend: 0.0008,
        description: "Global consumer goods retailer with diverse product lines."
      },
      { 
        id: 5, 
        name: "FinanceCorp", 
        symbol: "FNC", 
        price: 120, 
        volatility: 0.022, 
        industry: "Finance",
        trend: 0.0012,
        description: "Large financial services corporation offering banking and investment services."
      }
    ];
    
    setStocks(initialStocks);
    
    // Initialize buy/sell amounts
    const initialBuyAmount = {};
    const initialSellAmount = {};
    initialStocks.forEach(stock => {
      initialBuyAmount[stock.id] = 0;
      initialSellAmount[stock.id] = 0;
    });
    setBuyAmount(initialBuyAmount);
    setSellAmount(initialSellAmount);
    
    // Initialize historical data
    const initialHistory = {};
    initialStocks.forEach(stock => {
      initialHistory[stock.id] = [{
        day: 0,
        price: stock.price
      }];
    });
    setHistoricalData(initialHistory);
    
    // Reset other state
    setCash(10000);
    setPortfolio({});
    setCurrentDay(1);
    setGameOver(false);
    setMessage('Welcome to the Stock Market Simulator! Start by buying some stocks.');
    setNewsEvents([{
      day: 1,
      text: "Markets open with positive outlook. Analysts predict growth in Technology sector.",
      impact: "Technology stocks may perform well."
    }]);
  };

  // Update stock prices daily
  const updateMarket = () => {
    if (currentDay >= maxDays) {
      endGame();
      return;
    }
    
    // Generate random market news
    generateNewsEvent();
    
    // Update stock prices based on volatility, trends, and news
    const updatedStocks = stocks.map(stock => {
      // Base random movement
      let change = (Math.random() - 0.5) * 2 * stock.volatility;
      
      // Add trend component
      change += stock.trend;
      
      // Apply news effects if any
      const relevantNews = newsEvents.find(news => 
        news.day === currentDay && news.text.includes(stock.industry)
      );
      
      if (relevantNews) {
        if (relevantNews.text.includes('positive') || relevantNews.text.includes('growth')) {
          change += 0.01;
        } else if (relevantNews.text.includes('negative') || relevantNews.text.includes('decline')) {
          change -= 0.01;
        }
      }
      
      // Apply the change to the price
      let newPrice = stock.price * (1 + change);
      newPrice = Math.max(newPrice, 1); // Ensure the price doesn't go below 1
      
      // Update historical data
      const updatedHistory = [...historicalData[stock.id], {
        day: currentDay,
        price: newPrice
      }];
      
      setHistoricalData(prev => ({
        ...prev,
        [stock.id]: updatedHistory
      }));
      
      return {
        ...stock,
        price: newPrice,
        priceChange: change
      };
    });
    
    setStocks(updatedStocks);
    setCurrentDay(currentDay + 1);
    setMessage(`Day ${currentDay + 1}: Market has been updated.`);
  };

  // Generate random news events
  const generateNewsEvent = () => {
    if (Math.random() > 0.7) {
      const industries = ["Technology", "Energy", "Healthcare", "Retail", "Finance"];
      const selectedIndustry = industries[Math.floor(Math.random() * industries.length)];
      const isPositive = Math.random() > 0.5;
      
      let newsText = '';
      let impact = '';
      
      if (isPositive) {
        newsText = `Positive outlook for ${selectedIndustry} sector as new developments emerge.`;
        impact = `${selectedIndustry} stocks may rise.`;
      } else {
        newsText = `Concerns grow in the ${selectedIndustry} sector due to recent challenges.`;
        impact = `${selectedIndustry} stocks may decline.`;
      }
      
      const newsEvent = {
        day: currentDay + 1,
        text: newsText,
        impact: impact
      };
      
      setNewsEvents([...newsEvents, newsEvent]);
    }
  };

  // Buy stocks
  const buyStock = (stockId) => {
    const stock = stocks.find(s => s.id === stockId);
    const amount = buyAmount[stockId];
    
    if (!amount || amount <= 0) {
      setMessage("Please enter a valid amount to buy.");
      return;
    }
    
    const totalCost = stock.price * amount;
    
    if (totalCost > cash) {
      setMessage("Not enough cash to complete this purchase.");
      return;
    }
    
    // Update portfolio
    const updatedPortfolio = { ...portfolio };
    updatedPortfolio[stockId] = (updatedPortfolio[stockId] || 0) + amount;
    
    setPortfolio(updatedPortfolio);
    setCash(cash - totalCost);
    
    // Reset buy amount
    setBuyAmount({ ...buyAmount, [stockId]: 0 });
    
    setMessage(`Successfully purchased ${amount} shares of ${stock.symbol} for $${totalCost.toFixed(2)}.`);
  };

  // Sell stocks
  const sellStock = (stockId) => {
    const stock = stocks.find(s => s.id === stockId);
    const amount = sellAmount[stockId];
    
    if (!amount || amount <= 0) {
      setMessage("Please enter a valid amount to sell.");
      return;
    }
    
    const sharesOwned = portfolio[stockId] || 0;
    
    if (amount > sharesOwned) {
      setMessage(`You only own ${sharesOwned} shares of ${stock.symbol}.`);
      return;
    }
    
    const totalValue = stock.price * amount;
    
    // Update portfolio
    const updatedPortfolio = { ...portfolio };
    updatedPortfolio[stockId] = sharesOwned - amount;
    
    // Remove stock from portfolio if shares become 0
    if (updatedPortfolio[stockId] === 0) {
      delete updatedPortfolio[stockId];
    }
    
    setPortfolio(updatedPortfolio);
    setCash(cash + totalValue);
    
    // Reset sell amount
    setSellAmount({ ...sellAmount, [stockId]: 0 });
    
    setMessage(`Successfully sold ${amount} shares of ${stock.symbol} for $${totalValue.toFixed(2)}.`);
  };

  // Calculate total portfolio value
  const calculatePortfolioValue = () => {
    let total = cash;
    
    Object.keys(portfolio).forEach(stockId => {
      const stock = stocks.find(s => s.id === parseInt(stockId));
      if (stock) {
        total += stock.price * portfolio[stockId];
      }
    });
    
    return total;
  };

  // End game and show results
  const endGame = () => {
    const finalValue = calculatePortfolioValue();
    const profit = finalValue - 10000;
    const percentageReturn = ((profit / 10000) * 100).toFixed(2);
    
    let resultMessage = `Game Over! Your final portfolio value is $${finalValue.toFixed(2)}. `;
    
    if (profit > 0) {
      resultMessage += `You made a profit of $${profit.toFixed(2)} (${percentageReturn}%).`;
    } else if (profit < 0) {
      resultMessage += `You lost $${Math.abs(profit).toFixed(2)} (${percentageReturn}%).`;
    } else {
      resultMessage += "You broke even.";
    }
    
    setMessage(resultMessage);
    setGameOver(true);
  };

  // Handle input change for buy/sell amounts
  const handleBuyAmountChange = (stockId, value) => {
    setBuyAmount({ ...buyAmount, [stockId]: parseInt(value) || 0 });
  };
  
  const handleSellAmountChange = (stockId, value) => {
    setSellAmount({ ...sellAmount, [stockId]: parseInt(value) || 0 });
  };

  // View individual stock details and chart
  const viewStockDetails = (stock) => {
    setSelectedStock(stock);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 p-6 text-white">
      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full border border-indigo-600">
            <h2 className="text-2xl font-bold text-indigo-300 mb-4">Welcome to the Stock Market Simulator!</h2>
            <div className="space-y-4 text-gray-200">
              <p>In this simulation, you'll learn how to invest in the stock market without risking real money.</p>
              <h3 className="text-xl font-semibold text-indigo-200">How to Play:</h3>
              <ol className="list-decimal list-inside space-y-2 pl-2">
                <li>You start with $10,000 in cash to invest</li>
                <li>Buy and sell stocks from different industries</li>
                <li>Stock prices will change each day based on market conditions and news</li>
                <li>Pay attention to news events that may affect certain industries</li>
                <li>The simulation runs for 30 days</li>
                <li>Your goal is to maximize your portfolio value by the end of the simulation</li>
              </ol>
              <p>Remember, diversification (investing in different types of stocks) can help manage risk, but may limit potential returns.</p>
            </div>
            <button 
              onClick={() => setShowTutorial(false)}
              className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold w-full transition-colors"
            >
              Start Investing
            </button>
          </div>
        </div>
      )}
      
      {/* Main Game UI */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Left Column - Game controls and stats */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Game Stats */}
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-indigo-800">
              <h2 className="text-xl font-bold text-indigo-300 mb-4">Market Dashboard</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-900 bg-opacity-50 p-3 rounded-lg">
                  <p className="text-indigo-300 text-sm">Cash</p>
                  <p className="text-xl font-bold">${cash.toFixed(2)}</p>
                </div>
                <div className="bg-indigo-900 bg-opacity-50 p-3 rounded-lg">
                  <p className="text-indigo-300 text-sm">Portfolio Value</p>
                  <p className="text-xl font-bold">${(calculatePortfolioValue() - cash).toFixed(2)}</p>
                </div>
                <div className="bg-indigo-900 bg-opacity-50 p-3 rounded-lg">
                  <p className="text-indigo-300 text-sm">Total Value</p>
                  <p className="text-xl font-bold">${calculatePortfolioValue().toFixed(2)}</p>
                </div>
                <div className="bg-indigo-900 bg-opacity-50 p-3 rounded-lg">
                  <p className="text-indigo-300 text-sm">Day</p>
                  <p className="text-xl font-bold">{currentDay} / {maxDays}</p>
                </div>
              </div>
            </div>
            
            {/* Game Controls */}
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-indigo-800">
              <button 
                onClick={updateMarket}
                disabled={gameOver}
                className={`w-full py-3 px-4 rounded-lg font-bold text-white ${gameOver ? 'bg-gray-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} transition-colors`}
              >
                Advance to Next Day
              </button>
              
              {gameOver && (
                <button 
                  onClick={initializeGame}
                  className="mt-4 w-full py-3 px-4 rounded-lg font-bold bg-green-600 hover:bg-green-700 text-white transition-colors"
                >
                  Start New Game
                </button>
              )}
            </div>
            
            {/* News Feed */}
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-indigo-800">
              <h2 className="text-xl font-bold text-indigo-300 mb-2">Market News</h2>
              <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                {newsEvents.slice().reverse().map((news, index) => (
                  <div key={index} className="border-l-4 border-indigo-500 pl-3 py-2 bg-indigo-900 bg-opacity-30 rounded-r-lg">
                    <p className="text-sm text-indigo-200">Day {news.day}</p>
                    <p className="text-white">{news.text}</p>
                    <p className="text-sm text-indigo-300 mt-1 italic">{news.impact}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Message Box */}
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-indigo-800">
              <h2 className="text-xl font-bold text-indigo-300 mb-2">Notifications</h2>
              <div className="bg-indigo-900 bg-opacity-30 p-3 rounded-lg">
                <p className="text-white">{message}</p>
              </div>
            </div>
          </div>
          
          {/* Right Column - Stocks and Portfolio */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Portfolio */}
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-indigo-800">
              <h2 className="text-xl font-bold text-indigo-300 mb-4">Your Portfolio</h2>
              {Object.keys(portfolio).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-indigo-800">
                        <th className="text-left py-2">Stock</th>
                        <th className="text-right py-2">Shares</th>
                        <th className="text-right py-2">Current Price</th>
                        <th className="text-right py-2">Value</th>
                        <th className="text-right py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(portfolio).map(stockId => {
                        const stock = stocks.find(s => s.id === parseInt(stockId));
                        const shares = portfolio[stockId];
                        const value = stock.price * shares;
                        
                        return (
                          <tr key={stockId} className="border-b border-indigo-800">
                            <td className="py-3">
                              <div>
                                <span className="font-bold">{stock.symbol}</span>
                                <span className="text-gray-400 text-sm ml-2">({stock.name})</span>
                              </div>
                            </td>
                            <td className="text-right">{shares}</td>
                            <td className="text-right">${stock.price.toFixed(2)}</td>
                            <td className="text-right">${value.toFixed(2)}</td>
                            <td className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <input
                                  type="number"
                                  min="0"
                                  max={shares}
                                  value={sellAmount[stockId] || ''}
                                  onChange={(e) => handleSellAmountChange(stockId, e.target.value)}
                                  className="w-20 px-2 py-1 bg-indigo-900 border border-indigo-700 rounded text-white"
                                />
                                <button
                                  onClick={() => sellStock(parseInt(stockId))}
                                  className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded font-medium text-sm"
                                >
                                  Sell
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">You don't own any stocks yet. Start investing below!</p>
              )}
            </div>
            
            {/* Available Stocks */}
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-indigo-800">
              <h2 className="text-xl font-bold text-indigo-300 mb-4">Market Stocks</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-indigo-800">
                      <th className="text-left py-2">Stock</th>
                      <th className="text-left py-2">Industry</th>
                      <th className="text-right py-2">Price</th>
                      <th className="text-right py-2">Change</th>
                      <th className="text-right py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.map(stock => {
                      const priceChange = stock.priceChange || 0;
                      const changeColor = priceChange > 0 ? 'text-green-500' : (priceChange < 0 ? 'text-red-500' : 'text-gray-400');
                      
                      return (
                        <tr key={stock.id} className="border-b border-indigo-800">
                          <td className="py-3">
                            <div>
                              <span className="font-bold cursor-pointer hover:text-indigo-300" onClick={() => viewStockDetails(stock)}>
                                {stock.symbol}
                              </span>
                              <span className="text-gray-400 text-sm ml-2">({stock.name})</span>
                            </div>
                          </td>
                          <td>{stock.industry}</td>
                          <td className="text-right">${stock.price.toFixed(2)}</td>
                          <td className={`text-right ${changeColor}`}>
                            {priceChange > 0 ? '+' : ''}{(priceChange * 100).toFixed(2)}%
                          </td>
                          <td className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <input
                                type="number"
                                min="0"
                                value={buyAmount[stock.id] || ''}
                                onChange={(e) => handleBuyAmountChange(stock.id, e.target.value)}
                                className="w-20 px-2 py-1 bg-indigo-900 border border-indigo-700 rounded text-white"
                              />
                              <button
                                onClick={() => buyStock(stock.id)}
                                disabled={gameOver}
                                className={`px-3 py-1 rounded font-medium text-sm ${gameOver ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                              >
                                Buy
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Stock Details Modal */}
            {selectedStock && (
              <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full border border-indigo-600">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-indigo-300">
                      {selectedStock.name} ({selectedStock.symbol})
                    </h2>
                    <button 
                      onClick={() => setSelectedStock(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-300 mb-4">{selectedStock.description}</p>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-700">
                          <span className="text-gray-400">Current Price:</span>
                          <span className="font-bold">${selectedStock.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-700">
                          <span className="text-gray-400">Industry:</span>
                          <span>{selectedStock.industry}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-700">
                          <span className="text-gray-400">Volatility:</span>
                          <span>{(selectedStock.volatility * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-700">
                          <span className="text-gray-400">Shares Owned:</span>
                          <span>{portfolio[selectedStock.id] || 0}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-700">
                          <span className="text-gray-400">Position Value:</span>
                          <span>${((portfolio[selectedStock.id] || 0) * selectedStock.price).toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex space-x-4">
                        <div className="flex-1">
                          <label className="block text-sm text-gray-400 mb-1">Buy Shares</label>
                          <div className="flex space-x-2">
                            <input
                              type="number"
                              min="0"
                              value={buyAmount[selectedStock.id] || ''}
                              onChange={(e) => handleBuyAmountChange(selectedStock.id, e.target.value)}
                              className="w-full px-3 py-2 bg-indigo-900 border border-indigo-700 rounded text-white"
                            />
                            <button
                              onClick={() => buyStock(selectedStock.id)}
                              disabled={gameOver}
                              className={`px-4 py-2 rounded font-medium ${gameOver ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                            >
                              Buy
                            </button>
                          </div>
                        </div>
                        
                        {(portfolio[selectedStock.id] || 0) > 0 && (
                          <div className="flex-1">
                            <label className="block text-sm text-gray-400 mb-1">Sell Shares</label>
                            <div className="flex space-x-2">
                              <input
                                type="number"
                                min="0"
                                max={portfolio[selectedStock.id] || 0}
                                value={sellAmount[selectedStock.id] || ''}
                                onChange={(e) => handleSellAmountChange(selectedStock.id, e.target.value)}
                                className="w-full px-3 py-2 bg-indigo-900 border border-indigo-700 rounded text-white"
                              />
                              <button
                                onClick={() => sellStock(selectedStock.id)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded font-medium"
                              >
                                Sell
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-300 mb-4">Price History</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={historicalData[selectedStock.id]}
                            margin={{
                              top: 5,
                              right: 5,
                              left: 5,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis 
                              dataKey="day" 
                              label={{ value: 'Day', position: 'insideBottom', offset: -5 }}
                              stroke="#9CA3AF"
                            />
                            <YAxis 
                              label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }}
                              stroke="#9CA3AF"
                            />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4F46E5' }}
                              labelStyle={{ color: '#E5E7EB' }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="price" 
                              stroke="#4F46E5" 
                              strokeWidth={2}
                              dot={{ r: 2 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="mt-4 bg-indigo-900 bg-opacity-30 p-3 rounded-lg">
                        <h3 className="text-md font-semibold text-indigo-300 mb-2">Trading Tips</h3>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>• Buy low, sell high is the fundamental principle of trading.</li>
                          <li>• Pay attention to news events that might affect this stock.</li>
                          <li>• More volatile stocks can offer bigger returns, but with higher risk.</li>
                          <li>• Consider the industry trend when making investment decisions.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockMarketSimulator;