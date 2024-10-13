import React from 'react';
import { Container, Paper, Typography } from '@mui/material'; import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { fetchPosts } from '../../api/handle_post';


const Post: React.FC<{ id: string; user_id: string; content: string; image: string }> = ({ id, user_id, content, image }) => (
  <Paper elevation={3} style={{ padding: 16 }}>
    <Typography variant="h6" gutterBottom>
      {user_id}
    </Typography>
    <img src={image} alt={user_id} style={{ width: '100%', borderRadius: 8 }} />
    <Typography variant="h6" gutterBottom>
      {id}
    </Typography>
    <Typography variant="body2">
      {content}
    </Typography>
  </Paper>
);

const PostSpace = () => {

  const [posts, setPosts] = useState<any[]>([]);
  const backendApiUrl = process.env.BACKEND_API_URL;
  // console.log(backendApiUrl);

  useEffect(() => {
    const loadPosts = async () => {
      const updatedPosts = await fetchPosts();
      setPosts(updatedPosts);
    };
    
    loadPosts();
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
  )
};

export default PostSpace;


