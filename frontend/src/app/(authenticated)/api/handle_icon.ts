import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const postIcon = async (userId: string, image: File) => {
    const formData = new FormData();
    formData.append("image", image);

    let request_url = `${BACKEND_URL}/icon/${userId}`
    try {
        const response = await axios.post(request_url, formData, {
            headers: {
                'Accept': 'application/json',
            }
        });
        
        if (response.status !== 200 && response.status !== 201) {
            console.error(`Unexpected status code: ${response.status}`);
            return null;
        }
        const imageUrl = `${BACKEND_URL}/${response.data.image_path}`;
        return imageUrl;
    } catch (error) {
        console.error('Error posting icon:', error);
        return null;
    }
}

export const getIcon = async (userId: string): Promise<string | null> => {
    let request_url = `${BACKEND_URL}/icon/${userId}`
    try {
        const response = await axios.get(request_url, {
            headers: {
                'Accept': 'application/json',
            }
        });

        if (response.status !== 200) {
            console.error(`Unexpected status code: ${response.status}`);
            return null;
        }
    
        return response.data;
    } catch (error) {
        console.error('Error fetching icon:', error);
        return null;
    }
}