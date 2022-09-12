import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Clear";
import { useConfirm } from "material-ui-confirm";

import { selectUser } from "../redux/slices/auth";
import {
  fetchRemoveComment,
  fetchPostComments,
  fetchComments,
} from "../redux/slices/posts";
import Modal from "./Modal";

export const CommentsBlock = ({ items, children, isLoading = true }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const confirm = useConfirm();

  const onChangeModalData = (isOpen) => {
    setIsModalOpen(true);
    setTimeout(function () {
      setIsModalOpen(false);
    }, 4000);
  };

  const onClickRemove = (id) => {
    try {
      confirm({
        cancellationText: "Отмена",
        confirmationText: "Удалить",
        title: "Вы действительно хотите удалить комментарий?",
      })
        .then(async () => {
          const res = await dispatch(fetchRemoveComment(id));

          if (!res?.error) {
            dispatch(fetchPostComments(id));
            dispatch(fetchComments("limit=5"));
          } else {
            onChangeModalData(true);
          }
        })
        .catch((err) => {
          console.log(err);
          onChangeModalData(true);
        });
    } catch (err) {
      console.log(err);
      onChangeModalData(true);
    }
  };

  return (
    <>
      <SideBlock title="Комментарии">
        <List>
          {(isLoading ? [...Array(5)] : items).map((obj, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  {isLoading ? (
                    <Skeleton variant="circular" width={40} height={40} />
                  ) : (
                    <Avatar
                      alt={obj?.user?.fullName}
                      src={obj?.user?.avatarUrl}
                    />
                  )}
                </ListItemAvatar>
                {isLoading ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Skeleton variant="text" height={25} width={120} />
                    <Skeleton variant="text" height={18} width={230} />
                  </div>
                ) : (
                  <>
                    <ListItemText
                      primary={obj?.user.fullName}
                      secondary={obj?.text}
                    />
                    {user?._id === obj?.user._id && (
                      <IconButton
                        onClick={() => onClickRemove(obj?._id)}
                        color="secondary"
                        title={"Удалить"}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </>
                )}
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
        {children}
      </SideBlock>
      <Modal isOpen={isModalOpen} text={"Не удалось удалить комментарий"} />
    </>
  );
};
