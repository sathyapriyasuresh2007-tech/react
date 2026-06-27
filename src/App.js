import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import StatsCard from './components/StatsCard';
import Alert from './components/Alert';

function App() {
  const [stats, setStats] = useState(null);
  const [country, setCountry] = useState('all'); // ஆரம்பத்தில் உலகளாவிய டேட்டா (Global stats)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Live API-யில் இருந்து டேட்டாவை எடுக்க useEffect பயன்பாடு
  useEffect(() => {
    const fetchHealthData = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = country === 'all' 
          ? 'https://disease.sh/v3/covid-19/all' 
          : `https://disease.sh/v3/covid-19/countries/${country}`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Country not found or API error');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, [country]);

  const handleSearch = (searchCountry) => {
    setCountry(searchCountry);
  };

  return (
    <div className="app-container">
      <Header />
      <SearchBar onSearch={handleSearch} />

      {loading && <p className="status-text">Loading live data...</p>}
      {error && <p className="status-text error-text">❌ Error: {error}</p>}

      {stats && (
        <>
          {/* Conditional Alert Component */}
          <Alert activeCases={stats.active} />
          
          {/* Stats Display Component */}
          <StatsCard 
            data={stats} 
            countryName={country === 'all' ? 'Worldwide' : stats.country} 
          />
        </header>
      )}
    </div>
  );
}

export default App;