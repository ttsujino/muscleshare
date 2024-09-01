import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const posts = [
  {
    id: 1,
    title: 'Post 1',
    image: 'https://via.placeholder.com/300',
    content: 'This is the content of the first post.',
    user_name: 'user1'
  },
  {
    id: 2,
    title: 'Post 2',
    image: 'https://via.placeholder.com/300',
    content: 'This is the content of the second post.',
    user_name: 'user2'
  },
  // 他の投稿データ
];

const Post = ({ title, image, content, user_name }) => (
  <Paper elevation={3} style={{ padding: 16 }}>
    <Typography variant="h7" gutterBottom>
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

const PostSpace = () => (
  <Container>
    <Grid container spacing={2} justifyContent="center">
      {posts.map((post) => (
        <Grid item xs={12} sm={6} md={8} key={post.id}>
          <Post {...post} />
        </Grid>
      ))}
    </Grid>
  </Container>
);

export default PostSpace;
