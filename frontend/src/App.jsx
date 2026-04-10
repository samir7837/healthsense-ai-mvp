import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Track previous risk to trigger sound only on change
  const prevRiskRef = useRef(null);

  // Function to play alert sound
  const playAlertSound = () => {
    try {
      // Create a simple beep using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 880; // 880 Hz for alert
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.8);
      oscillator.stop(audioContext.currentTime + 0.8);
      
      // Resume audio context if suspended (browser autoplay policy)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
    } catch (err) {
      console.log('Audio not supported or blocked:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/status', {
          signal: abortController.signal,
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const result = await response.json();
        if (isMounted) {
          setData(result);
          setError(null);
          setLastUpdated(new Date());
          setIsLoading(false);
          
          // Check if risk changed to WARNING or HIGH RISK
          const currentRisk = result?.risk;
          const prevRisk = prevRiskRef.current;
          
          if (currentRisk && prevRisk !== currentRisk) {
            if (currentRisk === 'WARNING' || currentRisk === 'HIGH RISK') {
              playAlertSound();
            }
          }
          prevRiskRef.current = currentRisk;
        }
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted) {
          console.error('Fetch error:', err);
          setError(err.message);
          setIsLoading(false);
        }
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 2000);

    return () => {
      isMounted = false;
      abortController.abort();
      clearInterval(intervalId);
    };
  }, []);

  const getRiskClass = (risk) => {
    switch (risk) {
      case 'NORMAL': return 'risk-normal';
      case 'WARNING': return 'risk-warning';
      case 'HIGH RISK': return 'risk-high';
      default: return '';
    }
  };

  const bpm = data?.bpm ?? '—';
  const risk = data?.risk ?? null;
  const reason = data?.reason ?? 'Waiting for data...';

  return (
    <div className="dashboard-container">
      <div className={`dashboard-card ${risk ? getRiskClass(risk) : ''}`}>
        <div className="card-header">
          <h1 className="title">HealthSense AI</h1>
          <div className="subtitle">Real-time Health Monitor</div>
        </div>

        {isLoading && !data ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>Connecting to monitoring system...</p>
          </div>
        ) : error && !data ? (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <p className="error-message">Unable to connect to backend</p>
            <p className="error-detail">{error}</p>
            <p className="retry-info">Auto-retrying every 2 seconds...</p>
          </div>
        ) : (
          <>
            <div className="bpm-section">
              <div className="bpm-label">Heart Rate</div>
              <div className="bpm-value">
                {bpm}
                <span className="bpm-unit">BPM</span>
              </div>
            </div>

            <div className="risk-section">
              <div className="risk-label">Risk Level</div>
              <div className={`risk-value ${risk ? getRiskClass(risk) : ''}`}>
                {risk || '—'}
                {risk === 'WARNING' && <span className="alert-icon">⚠️</span>}
                {risk === 'HIGH RISK' && <span className="alert-icon">🚨</span>}
              </div>
            </div>

            <div className="reason-section">
              <div className="reason-label">Clinical Note</div>
              <div className="reason-text">{reason}</div>
            </div>

            {error && (
              <div className="warning-banner">
                ⚠️ Fetch warning: {error} (using cached data)
              </div>
            )}

            <div className="footer">
              {lastUpdated && (
                <div className="timestamp">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
              <div className="auto-refresh-badge">Live updates every 2s</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;