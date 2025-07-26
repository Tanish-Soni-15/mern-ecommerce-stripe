import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectAuthStatus, selectLoggedInUser, verifyUserAsync } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useEffect,useState } from "react";
function Protected({ children }) {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  const status=useSelector(selectAuthStatus);
  useEffect(() => {
    if (!user || status == 'loading') {
       dispatch(verifyUserAsync());
    }
  }, [dispatch, user]);
 
  if (!user && status == 'idle') {
    return <Navigate to="/login" replace={true}></Navigate>;
  }
  return children;
}

export default Protected;
