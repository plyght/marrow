'use client';

import { useState, useEffect } from 'react';

export default function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userCount, setUserCount] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserCount();
  }, []);

  const fetchUserCount = async () => {
    try {
      const response = await fetch('/api/waitlist');
      const data = await response.json();
      setUserCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching user count:', error);
      setUserCount(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      setMessage('Successfully joined the waitlist!');
      setEmail('');
      fetchUserCount(); // Refresh count
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 md:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--calcium-ivory)' }}>
          Join the Movement
        </h2>
        <p className="text-lg mb-8" style={{ color: 'var(--slate-graphite)' }}>
          Be the first to know when Marrow launches. Help us build the future of fair taxation.
        </p>

        {/* User Count Display */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-opacity-30" style={{ borderColor: 'var(--electric-cyan)' }}>
            <span className="text-sm font-medium" style={{ color: 'var(--electric-cyan)' }}>
              {userCount !== null ? `${userCount.toLocaleString()} people waiting` : 'Loading...'}
            </span>
          </div>
        </div>

        {/* Waitlist Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-lg border border-opacity-30 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-opacity-60 transition-all"
              style={{ borderColor: 'var(--slate-graphite)' }}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: loading ? 'var(--slate-graphite)' : 'var(--cobalt-pulse)',
                color: 'white'
              }}
            >
              {loading ? 'Joining...' : 'Join Waitlist'}
            </button>
          </div>
        </form>

        {/* Success/Error Messages */}
        {message && (
          <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'rgba(0, 217, 255, 0.1)', color: 'var(--electric-cyan)' }}>
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 55, 99, 0.1)', color: 'var(--infra-hotspot)' }}>
            {error}
          </div>
        )}

        <p className="text-sm mt-6" style={{ color: 'var(--slate-graphite)' }}>
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}