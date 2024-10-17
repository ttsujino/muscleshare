'use client';
import React from 'react';
import { Container, Paper, Typography } from '@mui/material'; import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { fetchUserPosts } from '../../api/handle_post';
import { useRouter } from 'next/navigation';
import { Post } from '../../api/handle_post';
import Image from 'next/image';
import Loading from './Loading';
import { useUser } from "@auth0/nextjs-auth0/client";

const DisplayPost: React.FC<{ id: string; user_id: string; content: string, image?: string }> = ({ id, user_id, content, image }) => {
  const router = useRouter();

  const handleImageClick = () => {
    router.push(`/post/${id}`);
  };

  return (
    <Paper elevation={3} style={{ padding: 16 }}>
      <Typography variant="h6" gutterBottom>
        {user_id}
      </Typography>
      <Image
        src={image}
        alt={user_id}
        width={500}
        height={300}
        style={{ width: '100%', height: 'auto', borderRadius: 8, cursor: 'pointer' }}
        onClick={handleImageClick}
      />
      <Typography variant="h6" gutterBottom>
        {id}
      </Typography>
      <Typography variant="body2">
        {content}
      </Typography>
    </Paper>
  );
};

const PostSpace = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // ローディング状態を追加
  const backendApiUrl = process.env.BACKEND_API_URL;
  const { user, isLoading, error } = useUser();

  useEffect(() => {
    const loadPosts = async () => {
      if (user) {
        const updatedPosts = await fetchUserPosts(user.sub);
        setPosts(updatedPosts);
      }
      setLoading(false);
    };

    if (!isLoading) {
      loadPosts();
    }
  }, [user, isLoading, backendApiUrl]);

  return (
    <div>
      <Container>
        {loading ? ( // ローディング中の表示
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Loading />
          </div>
        ) : (
          <Grid container spacing={2} justifyContent="center">
            {posts ? posts.map((post) => (
              <Grid size={4} key={post.id}>
                <DisplayPost {...post} />
              </Grid>
            )) : null}
          </Grid>
        )}
      </Container>
    </div>
  )
};

export default PostSpace;
