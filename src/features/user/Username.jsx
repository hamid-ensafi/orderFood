import { useSelector } from "react-redux";
import { getUserName } from "../cart/sliceCart";
function Username() {
  const username = useSelector(getUserName)
  if (!username) return null
  return <div className="hidden text-sm font-semibold md:block">{username}</div>;
}

export default Username;
