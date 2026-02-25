import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { HomeData } from '../types';
import { Loading, ErrorMessage, PostList, Sidebar } from '../components';

const Home: React.FC = () => {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const data = await apiService.getHomeData();
        setHomeData(data);
      } catch (err) {
        setError('Unable to load home data');
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!homeData) return <ErrorMessage message="No data available" />;

  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to My Blog</h1>
        <p>Sharing thoughts, experiences, and knowledge about technology</p>
      </section>

      <section className="latest-posts">
        <h2>Latest Posts</h2>
        <PostList posts={homeData.latestPosts} onFormatDate={formatDate} />
        <div className="view-all">
          <Link to="/blog" className="btn btn-primary">View All Posts</Link>
        </div>
      </section>

      <Sidebar categories={homeData.categories} tags={homeData.tags} />
    </div>
  );
};

export default Home;