import { cleanObject } from "./index";
import { useEffect } from "react";
import { useAsync } from "./use-async";
import { User } from "../types/user";
import { useHttp } from "./http";
import { useQuery } from "react-query";

// 获取用户信息
// export const useUsers = (param?: Partial<User>) => {
//   const client = useHttp();
//   const {run, ...result} = useAsync<User[]>()

//   useEffect(() => {
//     run(client("users", {data: cleanObject(param || {})}))
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [param])

//   return result
// }

export const useUsers = (param?: Partial<User>) => {
  const client = useHttp();

  // param 变化就会自动触发
  return useQuery<User[]>(["users", param], () =>
    client("users", { data: param })
  );
};
