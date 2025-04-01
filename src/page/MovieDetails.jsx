import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/movie/${id}`, API_OPTIONS);
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (isLoading) return <p>Loading movie details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="movie-details">
      <div className="my-2">
        <Link to="/" className="back-button text-white">← Back to Home</Link>
      </div>
      {movie === null && <h1 className='text-white mt-10'>Loading . . .</h1>}
      {movie && (
        <div className="details-container">
          <div className="flex justify-between flex-col md:flex-row">
            <img 
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/no-movie.png'} 
              alt={movie.title} 
              className="movie-poster rounded-xl"
            />
            <div className="text-white text-left py-8 md:px-6">
              <h1 className='mb-5 text-6xl'>{movie.title}</h1>
              <p className='text-lg'><strong>Overview:</strong> {movie.overview || 'No overview available.'}</p>

              <div className="shadow-lg rounded-2xl p-6 border mt-5">
                <h2 className="text-xl font-semibold">Stat</h2>
                <div className="mt-4 space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Release Date:</span>  {movie.release_date}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Language:</span>{movie.original_language.toUpperCase()}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Rating:</span> ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
