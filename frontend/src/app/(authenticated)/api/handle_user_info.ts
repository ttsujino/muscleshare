
// Auth0 Management APIのURL
const auth0Domain = process.env.AUTH0_DOMAIN;
const auth0Token = process.env.AUTH0_API_TOKEN;

export const getUserByUsername = async (username: string) => {
    const query = `nickname:${username}`;
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