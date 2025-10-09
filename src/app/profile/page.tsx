"use client";

import React from "react";
import CommonLayout from "../../components/commonLayout/commonLayout";
import UserProfile from "../../components/userProfile/userProfile";

const ProfilePage: React.FC = () => {
  return (
    <CommonLayout>
      <UserProfile />
    </CommonLayout>
  );
};

export default ProfilePage;
