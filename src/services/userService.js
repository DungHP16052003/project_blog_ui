import httpRequest from "../../utils/httpRequest";

export const getByUserName = async (username) => {
  const res = await httpRequest.get(`/users/${username}`);
  return res;
};
