import { Avatar, Box, Button, Card, CardContent, Container, Typography } from "@mui/material";
import useInfiniteGetData from "../components/customHooks/useInfiniteGetData";
import useGetData from "../components/customHooks/useGetData";
import { useNavigate } from "react-router-dom";

// const user = {
//   name: "Inprogress",
//   bio: "Web Developer | Tech Enthusiast",
//   profilePic: "https://via.placeholder.com/150",
//   posts: [
//     { id: 1, content: "Excited to start a new project! 🚀" },
//     { id: 2, content: "Learning MUI is fun! #React" },
//     { id: 3, content: "Any recommendations for JavaScript books?" },
//   ],
// };

const ProfilePage = () => {

  const {data: user, isLoading, isError} = useGetData(`api/profile`);
  const navigate = useNavigate();

  const handleEditProfile = ()=>{
    navigate("/edit-profile", { state: { user } });
  }

  // const {data: posts} = useInfiniteGetData(`api/user-posts`);
  if(isLoading){
    return <></>
  }


  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {/* Profile Header */}
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar src={user.profile_pic} sx={{ width: 80, height: 80 }} />
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {user.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user.bio}
          </Typography>
        </Box>
        <Button onClick={handleEditProfile} variant="outlined" sx={{ marginLeft: "auto" }}>
          Edit Profile
        </Button>
      </Box>

      {/* User Posts */}
      {/* <Box mt={4}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Posts
        </Typography>
        {posts.map((post) => (
          <Card key={post.id} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography>{post.content}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box> */}
    </Container>
  );
};

export default ProfilePage;
