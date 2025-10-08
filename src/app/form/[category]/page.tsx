"use client";

import React from "react";
import { useParams } from "next/navigation";
import CommonLayout from "../../../components/commonLayout";
import DynamicFormV2 from "../../../components/forms/DynamicFormV2";

const CategoryFormPage: React.FC = () => {
  const params = useParams();
  const category = params.category as string;

  return (
    <CommonLayout>
      <DynamicFormV2 categoryKey={category} showCategorySelector={false} />
    </CommonLayout>
  );
};

export default CategoryFormPage;
