import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

const Post: React.FC<{ title: string; image: string; content: string; user_name: string }> = ({ title, image, content, user_name }) => (
  <Paper elevation={3} style={{ padding: 16 }}>
    <Typography variant="h6" gutterBottom>
      {user_name}
    </Typography>
    <img src={image} alt={title} style={{ width: '100%', borderRadius: 8 }} />
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2">
      {content}
    </Typography>
  </Paper>
);

const PostSpace = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const backendApiUrl = process.env.BACKEND_API_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${backendApiUrl}/posts`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [backendApiUrl]);

  return (
    <div>
      <Container>
        <Grid container spacing={2} justifyContent="center">
          {posts.map((post) => (
            <Grid size={4} key={post.id}>
              <Post {...post} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default PostSpace;
