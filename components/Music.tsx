"use client";
import React, { useState } from 'react';
import axios from 'axios';

const moods: Record<string, string> = {
  Happy: 'Pop, Guitar, birdsong, ambient beats',
  Sad: 'Soft, piano, rainfall, pink noise',
  Sleepy: 'Ambient, flute, ocean waves, brown noise',
  Exciting: 'Funk, Guitar, river stream, Rhythmic drumming',
  Spiritual: 'Ambient, violin, Forest ambience, Rhythmic Drumming',
  Peaceful: 'Soothing, piano, ocean waves, brown noise',
  Motivated: 'Pop, guitar, birdsong, ambient beats',
  Calm: 'Jazz, flute, rainfall, pink noise',
  Stress: 'Soothing, violin, forest ambience, brown noise',
};

const Music: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string>('Happy');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null); 
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerateMusic = async () => {
    setIsLoading(true);
  
    try {
      const response = await axios.post('/api/getprompt', {
        mood: selectedMood,
        details: moods[selectedMood],
      });
  
      if (response.status === 200) {
        const { prompt } = response.data;
        setPrompt(prompt);
        await generateMusic(prompt);
      } else {
        throw new Error(response.data.error || 'Failed to generate prompt');
      }
    } catch (error:any) {
      setError(error.message || 'Failed to generate music');
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateMusic = async (prompt: string) => {
    try {
      const response = await axios.post('/api/music', {
        prompt,
      });
  
      if (response.status === 200) {
        const { url } = response.data;
        setAudioUrl(url);
        setError(null);
      } else {
        throw new Error(response.data.error || 'Failed to generate music');
      }
    } catch (error:any) {
      setError(error.message || 'Failed to generate music');
    }
  };
  
  const handleMoodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMood(event.target.value);
  };

  return (
    <div className="container">
      <div className="content">
        <h1>Generate Music</h1>
        <label htmlFor="moodSelect">Select Mood:</label>
        <select id="moodSelect" value={selectedMood} onChange={handleMoodChange}>
          {Object.keys(moods).map((mood) => (
            <option key={mood} value={mood}>
              {mood}
            </option>
          ))}
        </select>
        <button onClick={handleGenerateMusic} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Music'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {prompt && <p>Generated Prompt: {prompt}</p>}
        {audioUrl && (
          <div>
            <h2>Generated Music:</h2>
            <audio controls>
              <source src={audioUrl} type="audio/wav"/>
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
          background-color: #f0f0f0;
        }
        .content {
          text-align: center;
          width: 80%;
          max-width: 600px;
          padding: 20px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        select,
        button {
          padding: 8px;
          margin-bottom: 10px;
        }
        button {
          background-color: #0070f3;
          color: white;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default Music;
