import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid";

import { CommentsBlock } from "../CommentsBlock";
import { TagsBlock } from "../TagsBlock";

const Sidebar = () => {
  const { lastComments, tags } = useSelector((state) => state.posts);

  const isTagsLoading = tags.status === "loading";
  const isCommentsLoading = lastComments.status === "loading";

  return (
    <Grid xs={4} item>
      <TagsBlock items={tags.items} isLoading={isTagsLoading} />
      <CommentsBlock items={lastComments.items} isLoading={isCommentsLoading} />
    </Grid>
  );
};

export default Sidebar;
