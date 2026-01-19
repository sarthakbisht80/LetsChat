import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import './Languages.css'
import { TMDB_Access_Key } from '../../config'

const Languages = () => {
  const [internationalMovies, setInternationalMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('ko'); // Default to Korean

  const languages = [
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' }
  ];

  const fetchInternationalMovies = async (page = 1, append = false) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?language=${selectedLanguage}&sort_by=popularity.desc&page=${page}`,
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
          setInternationalMovies(prev => [...prev, ...data.results]);
        } else {
          setInternationalMovies(data.results);
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
    fetchInternationalMovies(nextPage, true);
  };

  const changeLanguage = (langCode) => {
    setSelectedLanguage(langCode);
    setCurrentPage(1);
    setInternationalMovies([]);
    setHasMore(true);
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchInternationalMovies(1, false);
  }, [selectedLanguage]);

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === selectedLanguage) || languages[0];
  };

  return (
    <div className='languages-page'>
      <Navbar />
      <div className='languages-content'>
        <div className="page-header">
          <h1>Browse by Languages</h1>
          <p>Discover amazing content from around the world</p>
        </div>
        
        <div className="language-selector">
          <h3>Select Language:</h3>
          <div className="language-buttons">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`language-btn ${selectedLanguage === lang.code ? 'active' : ''}`}
              >
                <span className="flag">{lang.flag}</span>
                <span className="name">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        {!loading && internationalMovies.length > 0 && (
          <div className="results-summary">
            <p>Showing {internationalMovies.length} of {totalResults} {getCurrentLanguage().name} movies</p>
          </div>
        )}
        
        <div className='international-grid'>
          {internationalMovies.map((movie) => (
            <div key={movie.id} className='international-card'>
              <Link to={`/player/${movie.id}`} state={{ name: movie.original_title }} className="international-link">
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
                    <span className="language">{getCurrentLanguage().name}</span>
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
              {loading ? 'Loading...' : `Load More ${getCurrentLanguage().name} Movies`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Languages
