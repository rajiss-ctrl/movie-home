import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [providers, setProviders] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/movie/${id}`, API_OPTIONS);
        if (!response.ok) throw new Error('Failed to fetch movie details');
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchWatchProviders = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/movie/${id}/watch/providers`, API_OPTIONS);
        if (!response.ok) throw new Error('Failed to fetch watch providers');
        const data = await response.json();
        setProviders(data.results.US || {}); // Default to US providers
      } catch (err) {
        console.error('Error fetching watch providers:', err);
      }
    };

    fetchMovieDetails();
    fetchWatchProviders();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-white animate-pulse">Loading movie details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="movie-details px-5 md:px-16 py-12">
      <div className="my-2 text-center">
        <Link to="/" className="back-button text-white ">← Back to Home</Link>
      </div>

      <div className="details-container">
        <div className="flex justify-between flex-col md:flex-row">
          <img 
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/no-movie.png'} 
            alt={movie.title} 
            className="movie-poster rounded-xl"
          />
          <div className="text-white text-left py-8 md:px-10">
            <h1 className="mb-5 text-6xl">{movie.title}</h1>
            <p className="text-lg"><strong>Overview:</strong> {movie.overview || 'No overview available.'}</p>

            <div className="shadow-lg rounded-2xl p-6 border mt-5">
              <h2 className="text-xl font-semibold">Stats</h2>
              <div className="mt-4 space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Release Date:</span> {movie.release_date}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Language:</span> {movie.original_language.toUpperCase()}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Rating:</span> ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </p>
              </div>
            </div>

            {/* Watch Providers Section */}
            {providers && (providers.flatrate || providers.buy || providers.rent) && (
              <div className="shadow-lg rounded-2xl p-6 border mt-5">
                <h2 className="text-xl font-semibold">Where to Watch</h2>
                <div className="mt-4 flex flex-wrap gap-4">
                  {providers.flatrate?.map((provider) => (
                    <a 
                      key={provider.provider_id} 
                      href={`https://www.justwatch.com/us/movie/${movie.title.replace(/\s+/g, '-').toLowerCase()}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-center transition hover:opacity-80"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                        alt={provider.provider_name}
                        className="h-12 mx-auto"
                      />
                      <p className="text-sm text-white">{provider.provider_name}</p>
                    </a>
                  ))}
                </div>
                <p className="text-sm mt-2">
                  More options available on{" "}
                  <a 
                    href={`https://www.themoviedb.org/movie/${id}/watch`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    TMDb Watch Providers
                  </a>
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
