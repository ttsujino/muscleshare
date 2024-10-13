"use client";

import { useEffect, useState } from "react";
import { fetchPost, Post }  from "../../api/handle_post";
import { Container, Paper, Typography } from '@mui/material';
import style from './page.module.css';
import { deletePost } from "../../api/handle_post";

const handleDeletePost = async (image_id: string) => {
    await deletePost(image_id);
    window.location.href = '/main'; // リダイレクト
};


const DisplayPost: React.FC<{ id: string; user_id: string; content: string; image_id: string, image: string }> = ({ id, user_id, content, image_id, image }) => (
  <Paper elevation={3} style={{ padding: 50 }}>
    <button onClick={() => handleDeletePost(image_id)} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>削除</button>
    <Typography variant="h6" gutterBottom>
      user_id: {user_id}
    </Typography>
    <img src={image} alt={user_id} style={{ width: '100%', borderRadius: 8 }} />
    <Typography variant="h6" gutterBottom>
      id: {id}
    </Typography>
    <Typography variant="body2">
      content: {content}
    </Typography>
  </Paper>
);

export default function ImagePage({ params }: { params: { image_id: string } }) {
  const { image_id } = params;
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<Post | null>(null);
  const backendApiUrl = process.env.BACKEND_API_URL;

  useEffect(() => {
    const loadPost = async () => {
      const updatedPost = await fetchPost(image_id) || null;
      setPost(updatedPost);
    };
    
    loadPost();
  }, [backendApiUrl]);

  useEffect(() => {
    if (post !== null) {
      setLoading(false);
    }
  }, [post]);

  return (
    <div>
      <Container className={style.post_container}>
        {post && <DisplayPost {...{ ...post, image: post.image || '' }} />}
      </Container>
    </div>
  );
}
