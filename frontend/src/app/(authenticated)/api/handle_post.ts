import axios from 'axios';

export const fetchPosts = async () => {
    try {
        const response = await axios.get("http://localhost:3000/posts");
        const data = await response.data;
        const updatedPosts = data.map((post: any) => ({
        ...post,
        image: `http://localhost:3000/image/${post.image_id}`
        }));
    
        return updatedPosts;
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

export const fetchPost = async (image_id: string) => {
    try {
        const response = await axios.get(`http://localhost:3000/post/${image_id}`);
        const data = await response.data;
        const updatedPost = {
            ...data,
            image: `http://localhost:3000/image/${data.image_id}`
        };
        return updatedPost;
    } catch (error) {
        console.error('Error fetching post:', error);
    }
}