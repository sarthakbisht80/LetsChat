import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'
import Navbar from '../../components/Navbar/Navbar'
import hero_banner from '../../assets/hero_banner.jpg'
import hero_title from '../../assets/hero_title.png'
import play_icon from '../../assets/play_icon.png'
import info_icon from '../../assets/info_icon.png'
import TitleCards from '../../components/TitileCards/TitleCards'
import Footer from '../../components/Footer/Footer'
import { TMDB_Access_Key } from '../../config'

const Home = () => {
  const navigate = useNavigate();
  const [heroMovie, setHeroMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroMovie = async () => {
      try {
        // Fetch a popular movie for the hero banner
        const response = await fetch(
          'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${TMDB_Access_Key}`
            }
          }
        );
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          // Get the first popular movie
          const movie = data.results[0];
          setHeroMovie(movie);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroMovie();
  }, []);

  const handlePlay = () => {
    if (heroMovie) {
      navigate(`/player/${heroMovie.id}`, { 
        state: { name: heroMovie.original_title } 
      });
    }
  };

  const handleMoreInfo = () => {
    if (heroMovie) {
      navigate(`/movie/${heroMovie.id}`);
    }
  };
  

  return (
    <div className='home'>
      <Navbar/>
      <div className="hero">
        {!loading && heroMovie ? (
          <>
            <img 
              src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`} 
              alt={heroMovie.original_title} 
              className='banner-img'
            />
            <div className="hero-caption">
              <h1 className="hero-title">{heroMovie.original_title}</h1>
              <p>{heroMovie.overview}</p>
              <div className="hero-btns">
                <button className='btn' onClick={handlePlay}>
                  <img src={play_icon} alt="" />Play
                </button>
                <button className='btn dark-btn' onClick={handleMoreInfo}>
                  <img src={info_icon} alt="" />More Info
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <img src={hero_banner} alt="" className='banner-img'/>
            <div className="hero-caption">
              <img src={hero_title} alt="" className='caption-img'/>
              <p>Discovering his ties to a secret ancient order, a young man living in modern Istanbul embarks on a quest to save the city from an immortal enemy.</p>
              <div className="hero-btns">
                <button className='btn'><img src={play_icon} alt="" />Play</button>
                <button className='btn dark-btn'><img src={info_icon} alt="" />More Info</button>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="more-cards">
        <TitleCards title={"Blockbuster Movies"} category={"top_rated"}/>
        <TitleCards title={"Only on Netflix"} category={"popular"}/>
        <TitleCards title={"Upcoming"} category={"upcoming"}/>
        <TitleCards title={"Top Pics for You"} category={"now_playing"}/>
      </div>
      <Footer/>
    </div>
  )
}

export default Home
