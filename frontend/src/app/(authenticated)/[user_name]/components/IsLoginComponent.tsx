// 'use client';
import { Icon } from "@mui/material";
import { useUserContext } from "../../context/UserContext";

function getLoginUserInfo() {
    const { loginUserInfo } = useUserContext();
    return loginUserInfo;
}

export function isLoginUser(userId: string) {
    const loginUserInfo = getLoginUserInfo()
    return userId === loginUserInfo.auth_user_id;
}

// export function updatePofileButton(isLoginUser: boolean) {
    
//     return (
//         isLoginUser && (
//             <div>
//                 <a href="/post">
//                     <Icon baseClassName="fas" className="fa-plus-circle" />
//                 </a>
//             </div>
//         )
//     );
// }