import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import DeleteIcon from "@mui/icons-material/Clear";
import { IconButton } from "@mui/material";

import { SideBlock } from "./SideBlock";

export const TagsBlock = ({ items, isLoading = true }) => {
	const { tag } = useParams();
	const navigate = useNavigate();

	return (
		<SideBlock title="Тэги">
			<List>
				{(isLoading ? [...Array(5)] : items).map((name, i) => {
					const isCurrentTag = name === tag;
					const key = !name ? i : name;

					return (
						<ListItem disablePadding key={key}>
							<ListItemButton>
								<Link
									style={{
										display: "flex",
										width: "100%",
										textDecoration: "none",
										color: "black",
									}}
									to={`/category/${name}`}
								>
									<ListItemIcon>
										<TagIcon />
									</ListItemIcon>
									{isLoading ? (
										<Skeleton width={100} />
									) : (
										<ListItemText primary={name} />
									)}
								</Link>
								{isCurrentTag && !isLoading && (
									<IconButton
										onClick={() => navigate("/")}
										color="secondary"
										size="small"
										title={"Вернуться к блогу"}
									>
										<DeleteIcon />
									</IconButton>
								)}
							</ListItemButton>
						</ListItem>
					);
				})}
			</List>
		</SideBlock>
	);
};
