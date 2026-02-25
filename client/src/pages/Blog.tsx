import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { PostsResponse, Category, Tag } from '../types';
import { 
  Loading, 
  ErrorMessage, 
  PostList, 
  Sidebar, 
  Pagination
} from '../components';

interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  city: string;
}

const getWeatherEmoji = (code: number): string => {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 49) return '🌫️';
  if (code <= 69) return '🌧️';
  if (code <= 79) return '🌨️';
  if (code <= 99) return '⛈️';
  return '🌡️';
};

const getWeatherDesc = (code: number): string => {
  if (code === 0) return 'Clear sky';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 49) return 'Foggy';
  if (code <= 69) return 'Rainy';
  if (code <= 79) return 'Snowy';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
};

const Blog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [postsData, setPostsData] = useState<PostsResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentCategory = searchParams.get('category');
  const currentTag = searchParams.get('tag');

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Weather via geolocation + Open-Meteo
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const [weatherRes, geoRes] = await Promise.all([
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`),
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`),
        ]);
        const weatherJson = await weatherRes.json();
        const geoJson = await geoRes.json();
        const addr = geoJson.address ?? {};
        setWeather({
          temperature: weatherJson.current_weather.temperature as number,
          windspeed: weatherJson.current_weather.windspeed as number,
          weathercode: weatherJson.current_weather.weathercode as number,
          city: (addr.city ?? addr.town ?? addr.village ?? addr.county ?? 'Unknown') as string,
        });
      } catch {
        // Weather unavailable — silent fail
      }
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsResponse, categoriesResponse, tagsResponse] = await Promise.all([
          apiService.getPosts({
            page: currentPage,
            category: currentCategory || undefined,
            tag: currentTag || undefined,
          }),
          apiService.getCategories(),
          apiService.getTags(),
        ]);

        setPostsData(postsResponse);
        setCategories(categoriesResponse);
        setTags(tagsResponse);
      } catch (err) {
        setError('Unable to load blog data');
        console.error('Error fetching blog data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, currentCategory, currentTag]);

  const handleCategoryFilter = (categorySlug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (categorySlug === currentCategory) {
      newParams.delete('category');
    } else {
      newParams.set('category', categorySlug);
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  const handleTagFilter = (tagSlug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (tagSlug === currentTag) {
      newParams.delete('tag');
    } else {
      newParams.set('tag', tagSlug);
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!postsData) return <ErrorMessage message="No data available" />;

  return (
    <div className="blog">
      <div className="blog-header">
        <div className="blog-header-top">
          <div className="blog-header-clock">
            <span className="clock-icon">🕐</span>
            <span className="clock-time">
              {currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className="clock-date">
              {currentTime.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          {weather && (
            <div className="blog-header-weather">
              <span className="weather-emoji">{getWeatherEmoji(weather.weathercode)}</span>
              <span className="weather-temp">{weather.temperature}°C</span>
              <span className="weather-desc">{getWeatherDesc(weather.weathercode)}</span>
              <span className="weather-city">📍 {weather.city}</span>
              <span className="weather-wind">💨 {weather.windspeed} km/h</span>
            </div>
          )}
        </div>

        <div className="blog-header-title">
          <h1>Golb</h1>
          <p>All posts about technology and life</p>
        </div>

        <div className="blog-header-stats">
          {postsData && (
            <>
              <div className="stat-chip">📝 {postsData.posts.length} posts on this page</div>
              <div className="stat-chip">📄 Page {postsData.currentPage ?? 1} of {postsData.totalPages || 1}</div>
            </>
          )}
        </div>
      </div>

      <div className="blog-container">
        <Sidebar
          categories={categories}
          tags={tags}
          currentCategory={currentCategory}
          currentTag={currentTag}
          onCategoryFilter={handleCategoryFilter}
          onTagFilter={handleTagFilter}
        />

        <main className="blog-main">
          {postsData.posts.length === 0 ? (
            <div className="no-posts">No posts found.</div>
          ) : (
            <>
              <PostList posts={postsData.posts} />
              {postsData.totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={postsData.totalPages}
                  hasNext={postsData.hasNext}
                  hasPrev={postsData.hasPrev}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Blog;