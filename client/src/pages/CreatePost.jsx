import React, { useState } from 'react';
import api from '../config/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const submitTextPost = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      return toast.error('Please enter some text for your post.');
    }

    const formData = new FormData();
    formData.append('text', text);

    try {
      setLoading(true);
      await api.post('/user/posts/post', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Text post created!');
      navigate('/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create text post.');
    } finally {
      setLoading(false);
    }
  };

  const submitImagePost = async (e) => {
    e.preventDefault();

    if (!image) {
      return toast.error('Please upload an image.');
    }

    const formData = new FormData();
    formData.append('image', image);
    if (caption) formData.append('caption', caption);

    try {
      setLoading(true);
      await api.post('/user/posts/post', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Image post created!');
     navigate('/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create image post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create New Post</h2>

    
      <form onSubmit={submitTextPost} className="create-post-form">
        <h3>Text Post</h3>
        <textarea
          placeholder="Write your text post"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post Your Thoughts'}
        </button>
      </form>

      <hr style={{ margin: '30px 0' }} />

     
      <form onSubmit={submitImagePost} className="create-post-form">
        <h3>Image Post</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <input
          type="text"
          placeholder="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
