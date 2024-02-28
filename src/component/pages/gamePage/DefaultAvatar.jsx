import React, { Suspense } from "react";

export const DefaultAvatar = ({ avatarPath }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <img src={require(avatarPath).default} alt="Avatar" />
    </Suspense>
  );
};
