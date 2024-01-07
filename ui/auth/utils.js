// utils.js
// Utility function to get formatted username
export const getFormattedUsername = (userProfile, user) => {
  if (userProfile && userProfile.firstName) {
    return userProfile.firstName;
  } else if (user && user.username) {
    return user.username;
  } else {
    return 'Username not ready';
  }
};

export const calculateAge = (birthDate) => {
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }

  return age;
};
