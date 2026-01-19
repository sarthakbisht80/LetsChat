import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TMDB_Access_Key } from '../../config';

const MovieInfo = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch movie details
        const resMovie = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_Access_Key}`
          }
        });
        const movieData = await resMovie.json();
        setMovie(movieData);

        // Fetch movie credits (cast)
        const resCast = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`, {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_Access_Key}`
          }
        });
        const castData = await resCast.json();
        setCast(castData.cast.slice(0, 8)); // top 8 cast members
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="movie-info">
      {movie && (
        <>
          <h1>{movie.title}</h1>
          <p>{movie.overview}</p>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> {movie.vote_average} / 10</p>

          <h2>Cast</h2>
          <div className="cast-list" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {cast.map(actor => (
              <div key={actor.id} style={{ textAlign: 'center' }}>
                <img 
                  src={actor.profile_path 
                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` 
                    : 'https://via.placeholder.com/200x300?text=No+Image'} 
                  alt={actor.name} 
                  style={{ borderRadius: '10px', width: '150px' }}
                />
                <p>{actor.name}</p>
                <small>as {actor.character}</small>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MovieInfo;
