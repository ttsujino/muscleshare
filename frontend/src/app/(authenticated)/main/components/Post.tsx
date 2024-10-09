import React from 'react';
import { Container, Paper, Typography } from '@mui/material'; import Grid from '@mui/material/Grid2';
import axios from 'axios';
import { useEffect, useState } from 'react';

// const posts = [
//   {
//     id: 1,
//     title: 'Post 1',
//     image: 'https://via.placeholder.com/300',
//     content: 'This is the content of the first post.',
//     user_name: 'user1'
//   },
//   {
//     id: 2,
//     title: 'Post 2',
//     image: 'https://via.placeholder.com/300',
//     content: 'This is the content of the second post.',
//     user_name: 'user2'
//   },
//   {
//     id: 3,
//     title: 'Post 3',
//     image: 'https://via.placeholder.com/300',
//     content: 'This is the content of the third post.',
//     user_name: 'user3'
//   },
//   {
//     id: 4,
//     title: 'Post 4',
//     image: 'https://via.placeholder.com/300',
//     content: 'This is the content of the fourth post.',
//     user_name: 'user4'
//   },
//   {
//     id: 5,
//     title: 'Post 5',
//     image: 'https://via.placeholder.com/300',
//     content: 'This is the content of the fifth post.',
//     user_name: 'user5'
//   },
//   {
//     id: 6,
//     title: 'Post 6',
//     image: 'https://via.placeholder.com/300',
//     content: 'This is the content of the sixth post.',
//     user_name: 'user6'
//   }
// ];




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
  // console.log(backendApiUrl);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/posts");
        const data = await response.data;
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }
    
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

