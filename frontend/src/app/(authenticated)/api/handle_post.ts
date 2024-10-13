import axios from 'axios';

interface Post {
    id: string;
    user_id: string;
    content: string;
    image_id: string;
}

export const fetchPosts = async (): Promise<Post[] | undefined> => {
    try {
        const response = await axios.get("http://localhost:3000/posts");
        const data: Post[] = await response.data;
        const updatedPosts = data.map((post) => ({
            ...post,
            image: `http://localhost:3000/image/${post.image_id}`
        }));
    
        return updatedPosts;
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

export const fetchPost = async (image_id: string): Promise<Post | undefined> => {
    try {
        const response = await axios.get(`${process.env.BACKEND_API_URL}/post/${image_id}`);
        const data: Post = await response.data;
        const updatedPost = {
            ...data,
            image: `http://localhost:3000/image/${data.image_id}`
        };
        return updatedPost;
    } catch (error) {
        console.error('Error fetching post:', error);
    }
}