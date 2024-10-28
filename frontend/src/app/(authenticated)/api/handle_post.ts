import axios from 'axios';


export interface Post {
    id: string;
    user_id: string;
    content: string;
    image?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const createPost = async (content: string, image: File, user_id: string | null | undefined) => {
    const formData = new FormData();
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    const response = await fetch(`${BACKEND_URL}/post/new/${user_id}`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });

    return response;
  };

export const fetchUserPosts = async (user_id: string): Promise<Post[] | null> => {
    try {
        const response = await axios.get(`${BACKEND_URL}/posts/${user_id}`);
        const data: Post[] = await response.data;
        const updatedPosts = data.map((post) => ({
            ...post,
            image: `${BACKEND_URL}/image/${post.id}`
        }));

        return updatedPosts;
    } catch (error) {
        console.error('Error fetching posts:', error);
        return null;
    }
}

// 現時点では未使用
// export const fetchAllPosts = async (): Promise<Post[] | null> => {
//     try {
//         const response = await axios.get("${BACKEND_URL}/posts");
//         const data: Post[] = await response.data;
//         const updatedPosts = data.map((post) => ({
//             ...post,
//             image: `${BACKEND_URL}/image/${post.id}`
//         }));
//         console.log('updatedPosts:', updatedPosts);

//         return updatedPosts;
//     } catch (error) {
//         console.error('Error fetching posts:', error);
//         return null;
//     }
// }

export const fetchPost = async (image_id: string): Promise<Post | null> => {
    try {
        const response = await axios.get(`${BACKEND_URL}/post/${image_id}`);
        const data: Post = await response.data;
        const updatedPost = {
            ...data,
            image: `${BACKEND_URL}/image/${data.id}`
        };
        return updatedPost;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

export const deletePost = async (image_id: string) => {
    try {
        await axios.delete(`${BACKEND_URL}/post/${image_id}`);
        alert('削除しました');
    } catch (error) {
        console.error('削除エラー:', error);
    }
}
