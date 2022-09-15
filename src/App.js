import { Routes, Route } from "react-router-dom";

import Container from "@mui/material/Container";

import { Header } from "./components";
import {
  Home,
  FullPost,
  Registration,
  AddPost,
  Login,
  Category,
} from "./pages";
import { useAuthMeQuery } from "./redux/services/auth";

function App() {
  useAuthMeQuery();

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/category/:tag" element={<Category />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
