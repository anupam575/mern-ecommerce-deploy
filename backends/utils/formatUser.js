export const formatUser = (user) => {
  if (!user) return null;

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    avatar: user.avatar?.url || null, // safe fallback if avatar missing
  };
};