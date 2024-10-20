import { Interface } from "readline";
import axios from "axios";

// Auth0 Management APIのURL
const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
const auth0Token = process.env.NEXT_PUBLIC_AUTH0_API_TOKEN;

export const getUserByAttribute = async (attribute: string, param: string) => {
  const query = `${attribute}:${param}`;
  const request_url = `https://${auth0Domain}/api/v2/users?q=${query}&search_engine=v3`;

  try {
    const response = await axios.get(request_url, {
      headers: {
        'Authorization': `Bearer ${auth0Token}`,
        'Content-Type': 'application/json',
      },
    });

    const users = response.data;
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error("Error fetching user by attribute:", error);
    return null;
  }
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
  let request_url = `https://${auth0Domain}/api/v2/users/${userId}`
  const response = await axios.patch(request_url, userInfo, {
    headers: {
      'Authorization': `Bearer ${auth0Token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });

  if (response.status !== 200) {
      return null;
  }

  return response.data;
};