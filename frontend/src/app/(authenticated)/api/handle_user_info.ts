import { Interface } from "readline";
import axios from "axios";

// Auth0 Management APIのURL
const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
const auth0Token = process.env.NEXT_PUBLIC_AUTH0_API_TOKEN;

export const getUserByAttribute = async (attribute: string, param: string) => {
    const query = `${attribute}:${param}`;
    let request_url = `https://${auth0Domain}/api/v2/users?q=${query}&search_engine=v3`
    const response = await fetch(request_url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${auth0Token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
        return null;
    }
  
    const users = await response.json();
    return users.length > 0 ? users[0] : null;  // 該当するユーザーが存在する場合は最初のユーザーを返す
  };

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { user_name } = req.query;

//   try {
//     const user = await getUserByUsername(user_name as string);

//     if (!user) {
//       res.status(404).json({ message: 'ユーザーが見つかりませんでした' });
//     } else {
//       res.status(200).json({ user });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'エラーが発生しました' });
//   }
// }

interface updateUserInfo {
  nickname?: string;
  icon?: string;
  user_metadata: { bio: string; };
}

export const updateUser = async (userId: string, userInfo: updateUserInfo) => {
  console.log("auth0Domain: ", auth0Domain);
  let request_url = `https://${auth0Domain}/api/v2/users/${userId}`
  console.log("request_url: ", request_url);
  console.log("request userInfo: ", userInfo);
  const response = await axios.patch(request_url, userInfo, {
    headers: {
      'Authorization': `Bearer ${auth0Token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });
  console.log("response: ", response.data);

  if (response.status !== 200) {
      return null;
  }
  console.log("response.data: ", response.data);

  return response.data;
};