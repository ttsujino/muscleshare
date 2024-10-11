import React from 'react';
import { Container, Paper, Typography } from '@mui/material'; import Grid from '@mui/material/Grid2';
import axios from 'axios';
import { useEffect, useState } from 'react';


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
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/posts");
        const data = await response.data;
        const updatedPosts = data.map((post: any) => ({
          ...post,
          image: `http://localhost:3000/image/${post.image_id}`
        }));

        setPosts(updatedPosts);
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
  )
};

export default PostSpace;


