"use client";

import React from "react";
import CommonLayout from "../../components/commonLayout";
import UserProfile from "../../components/userProfile";

const ProfilePage: React.FC = () => {
  return (
    <CommonLayout>
      <UserProfile />
    </CommonLayout>
  );
};

export default ProfilePage;
