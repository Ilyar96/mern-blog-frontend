import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import styles from "./UserInfo.module.scss";

export const UserInfo = ({ avatarUrl, fullName, additionalText }) => {
  return (
    <div className={styles.root}>
      <LazyLoadImage
        className={styles.avatar}
        src={avatarUrl || "/noavatar.png"}
        alt={fullName}
      />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
