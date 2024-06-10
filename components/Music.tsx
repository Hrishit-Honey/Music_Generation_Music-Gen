"use client";
import React, { useState } from 'react';

const Music: React.FC = () => {
  const [prompts, setPrompts] = useState<string[]>(['']);
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean[]>([]);

  const handleAddSlot = () => {
    setPrompts([...prompts, '']);
    setAudioUrls([...audioUrls, '']);
    setErrors([...errors, '']);
    setIsLoading([...isLoading, false]);
  };

  const handleSubmit = async (event: React.FormEvent, index: number) => {
    event.preventDefault();

    setIsLoading((prev) => prev.map((load, i) => (i === index ? true : load)));

    const prompt = prompts[index];
    

    try {
      const response = await fetch('/api/music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        const { url } = data;
        setAudioUrls([...audioUrls.slice(0, index), url, ...audioUrls.slice(index + 1)]);
      } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Failed to generate music');
      }
    } catch (error: any) {
      setErrors([...errors.slice(0, index), error.message || 'Failed to generate music', ...errors.slice(index + 1)]);
    } finally {
      setIsLoading((prev) => prev.map((load, i) => (i === index ? false : load)));
    }
  };

  const handlePromptChange = (index: number, value: string) => {
    setPrompts([...prompts.slice(0, index), value, ...prompts.slice(index + 1)]);
  };

  return (
    <div className="container">
      <div className="content">
        <h1 style={{ color: 'black' }}>Generate Music</h1>
        {prompts.map((prompt, index) => (
          <div key={index}>
            <form onSubmit={(e) => handleSubmit(e, index)} style={{ marginBottom: '20px' }}>
              <input
                type="text"
                value={prompt}
                onChange={(e) => handlePromptChange(index, e.target.value)}
                placeholder="Enter a prompt"
                style={{ color: 'black', border: '1px solid black', marginRight: '10px', padding: '5px' }}
              />
              <button type="submit" disabled={isLoading[index]} style={{ color: 'black', border: '1px solid black', padding: '5px' }}>
                {isLoading[index] ? 'Generating...' : 'Generate'}
              </button>
              {errors[index] && <p style={{ color: 'red' }}>{errors[index]}</p>}
            </form>
            {audioUrls[index] && (
              <div>
                <h2>Generated Music:</h2>
                <audio controls>
                  <source src={audioUrls[index]} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        ))}
        <button onClick={handleAddSlot} style={{ color: 'black', border: '1px solid black', padding: '5px', marginTop: '20px' }}>
          Add Music Slot
        </button>
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
