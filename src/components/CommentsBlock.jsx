import React from "react";
import { useSelector } from "react-redux";

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

import { selectUser } from "../redux/services/authSlice";
import Modal from "./Modal";
import { useDeleteCommentMutation } from "../redux/services/post";

export const CommentsBlock = ({ items, children, isLoading, commentsRef }) => {
	const user = useSelector(selectUser);
	const confirm = useConfirm();
	const [deleteComment, { isError }] = useDeleteCommentMutation();
	const comments = items ? items : [];

	const onClickRemove = (id) => {
		try {
			confirm({
				cancellationText: "Отмена",
				confirmationText: "Удалить",
				title: "Вы действительно хотите удалить комментарий?",
			})
				.then(async () => {
					deleteComment(id);
				})
				.catch((err) => {
					console.log(err);
				});
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<SideBlock title="Комментарии">
				{children}
				<List ref={commentsRef}>
					{(isLoading ? [...Array(5)] : comments).map((obj, index) => (
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
											className="sidebar-comment"
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
			</SideBlock>
			<Modal isOpen={isError} text={"Не удалось удалить комментарий"} />
		</>
	);
};
