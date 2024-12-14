'use client';
import React from 'react';
import { Container, Paper, Typography } from '@mui/material'; import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { fetchUserPosts } from '../../api/handle_post';
import { useRouter } from 'next/navigation';
import { Post } from '../../api/handle_post';
import Image from 'next/image';
import Loading from './Loading';

const DisplayPost: React.FC<{ id: string; user_id: string; content: string, image?: string }> = ({ id, user_id, content, image }) => {
  const router = useRouter();

  const handleImageClick = () => {
    router.push(`/post/${id}`);
  };

  return (
    <Paper elevation={5} style={{ padding: 16 }}>
      <Image
        src={image || '/default.jpg'}
        alt={user_id}
        width={500}
        height={300}
        style={{ width: '100%', height: 'auto', borderRadius: 8, cursor: 'pointer' }}
        onClick={handleImageClick}
        priority
      />
      <Typography variant="body2" style={{ paddingTop: '10px' }}>
        {content}
      </Typography>
    </Paper>
  );
};

const PostSpace: React.FC<{ user_info: any }> = ({ user_info }) => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // ローディング状態を追加

  useEffect(() => {
    const loadPosts = async () => {
      if (!user_info?.user_id) {
        setLoading(false);
        return;
      }

      const updatedPosts = await fetchUserPosts(user_info.user_id);
      setPosts(updatedPosts);
      setLoading(false);
    };

  loadPosts();
  }, [user_info]);

  return (
    <div>
      <Container>
        {loading ? ( // ローディング中の表示
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Loading />
          </div>
        ) : (
          <Grid container spacing={2} justifyContent="flex-start">
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
