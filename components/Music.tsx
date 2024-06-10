"use client";

import React, { useState } from 'react';

const Music: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAudioSrc(url);
        console.log('Music generated successfully');
      } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Failed to generate music');
      }
    } catch (error: any) {
      console.error('Error generating music:', error);
      setError(error.message || 'Failed to generate music');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="content">
        <h1 style={{ color: 'black' }}>Generate Music</h1>
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt"
            style={{ color: 'black', border: '1px solid black', marginRight: '10px', padding: '5px' }}
          />
          <button type="submit" disabled={isLoading} style={{ color: 'black', border: '1px solid black', padding: '5px' }}>
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {audioSrc && (
          <div>
            <h2>Generated Music:</h2>
            <audio controls>
              <source src={audioSrc} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: white;
        }
        .content {
          text-align: center;
        }
        input[type="text"], button {
          color: black;
          border: 1px solid black;
          padding: 5px;
        }
      `}</style>
    </div>
  );
};

export default Music;
