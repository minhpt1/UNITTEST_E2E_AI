import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { PostDetail as PostDetailType, CreateCommentRequest } from '../types';
import { 
  Loading, 
  ErrorMessage, 
  PostHeader, 
  PostContent, 
  PostFooter,
  CommentForm,
  CommentsList
} from '../components';

const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [postDetail, setPostDetail] = useState<PostDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentForm, setCommentForm] = useState<CreateCommentRequest>({
    authorName: '',
    authorEmail: '',
    content: '',
  });
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        navigate('/blog');
        return;
      }

      try {
        setLoading(true);
        const data = await apiService.getPostBySlug(slug);
        setPostDetail(data);
      } catch (err) {
        setError('Unable to load post');
        console.error('Error fetching post detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, navigate]);

  const handleCommentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCommentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !commentForm.authorName || !commentForm.authorEmail || !commentForm.content) {
      return;
    }

    try {
      setSubmittingComment(true);
      await apiService.addComment(slug, commentForm);
      setCommentForm({ authorName: '', authorEmail: '', content: '' });
      const updated = await apiService.getPostBySlug(slug);
      setPostDetail(updated);
    } catch (err) {
      alert('An error occurred while submitting comment');
      console.error('Error submitting comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!postDetail) return <ErrorMessage message="Post not found" />;

  const { post, comments } = postDetail;

  return (
    <div className="post-detail">
      <article className="post">
        <PostHeader post={post} onFormatDate={formatDate} />
        <PostContent post={post} />
        <PostFooter post={post} />
      </article>

      <section className="comments-section">
        <CommentsList comments={comments} onFormatDate={formatDate} />
        <CommentForm
          formData={commentForm}
          onInputChange={handleCommentInputChange}
          onSubmit={handleCommentSubmit}
          loading={submittingComment}
        />
      </section>
    </div>
  );
};

export default PostDetail;