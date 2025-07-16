import api from '../config/api';
import { toast } from 'react-toastify';
import {
  myPostsRequest,
  myPostsSuccess,
  myPostsFail,
} from '../slices/postSlice'; // ✅ import slice actions

export const fetchMyPosts = () => async (dispatch) => {
  try {
    dispatch(myPostsRequest());

    const res = await api.get('/user/posts/my', { withCredentials: true });


    dispatch(myPostsSuccess(res.data));
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to load posts';
    dispatch(myPostsFail(errorMessage));
    toast.error(errorMessage);
  }
};
