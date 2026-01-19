import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import './Movies.css'
import { TMDB_Access_Key } from '../../config'

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const fetchMovies = async (page = 1, append = false) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_Access_Key}`
          }
        }
      );
      const data = await response.json();
      
      if (data.results) {
        if (append) {
          setMovies(prev => [...prev, ...data.results]);
        } else {
          setMovies(data.results);
        }
        setTotalResults(data.total_results || 0);
        setHasMore(page < (data.total_pages || 0));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchMovies(nextPage, true);
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchMovies(1, false);
  }, []);

  return (
    <div className='movies-page'>
      <Navbar />
      <div className='movies-content'>
        <div className="page-header">
          <h1>Movies</h1>
          <p>Discover the latest blockbuster movies and timeless classics</p>
        </div>
        
        {!loading && movies.length > 0 && (
          <div className="results-summary">
            <p>Showing {movies.length} of {totalResults} movies</p>
          </div>
        )}
        
        <div className='movies-grid'>
          {movies.map((movie) => (
            <div key={movie.id} className='movie-card'>
              <Link to={`/player/${movie.id}`} state={{ name: movie.original_title }} className="movie-link">
                {movie.backdrop_path || movie.poster_path ? (
                  <img src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`} alt={movie.original_title} />
                ) : (
                  <div className='placeholder'>No Image</div>
                )}
                <div className="card-info">
                  <h3 className="movie-title">{movie.original_title}</h3>
                  <div className="movie-details">
                    <span className="rating">★ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
                    <span className="release-date">{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
                  </div>
                  <p className="movie-overview">{movie.overview}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="load-more-container">
            <button 
              onClick={loadMore} 
              className="load-more-btn"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More Movies'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Movies
