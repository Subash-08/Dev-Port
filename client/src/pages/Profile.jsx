import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyProfile } from '../actions/userActions';

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return profile ? (
    <div className="p-4">
      <h2 className="text-xl font-bold">Welcome, {profile.firstName}!</h2>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Bio:</strong> {profile.bio}</p>
      <img src={profile.avatar} alt="avatar" className="w-32 h-32 rounded-full" />
    </div>
  ) : null;
};

export default Profile;
