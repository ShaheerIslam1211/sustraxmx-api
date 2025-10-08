// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Row,
//   Col,
//   Card,
//   Button,
//   Select,
//   Input,
//   Form,
//   message,
//   Spin,
//   Typography,
//   Divider,
//   Alert,
//   Badge,
//   Space,
//   Collapse,
//   Tag,
// } from "antd";
// import {
//   PlayCircleOutlined,
//   ReloadOutlined,
//   ApiOutlined,
//   CheckCircleOutlined,
//   ExclamationCircleOutlined,
//   InfoCircleOutlined,
//   CodeOutlined,
// } from "@ant-design/icons";
// import { useEmissionData } from "../../context/EmissionDataContext";
// import { getDynamicFormsData } from "../../lib/firebase/client-forms-service";
// import "./index.css";

// const { Title, Text, Paragraph } = Typography;
// const { Option } = Select;
// const { TextArea } = Input;
// const { Panel } = Collapse;

// interface FormField {
//   name: string;
//   title: string;
//   required?: boolean;
//   type?: string;
//   description?: string;
// }

// interface CategoryInfo {
//   name: string;
//   title: string;
//   description: string;
//   requiredFields: string[];
//   allFields: FormField[];
// }

// interface ApiResponse {
//   success: boolean;
//   data?: any;
//   error?: string;
//   message?: string;
//   validationErrors?: string[];
//   requiredFields?: string[];
// }

// const DynamicApiTester: React.FC = () => {
//   const {
//     emissionData,
//     isLoading: contextLoading,
//     refreshForms,
//   } = useEmissionData();
//   const [form] = Form.useForm();

//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [categories, setCategories] = useState<CategoryInfo[]>([]);
//   const [formData, setFormData] = useState<Record<string, any>>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
//   const [responseTime, setResponseTime] = useState<number>(0);

//   // Load categories from the API
//   useEffect(() => {
//     loadCategories();
//   }, []);

//   const loadCategories = async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch("/api/calculate");
//       const result = await response.json();

//       if (result.success) {
//         setCategories(result.data.categories);
//       } else {
//         message.error("Failed to load categories");
//       }
//     } catch (error) {
//       console.error("Error loading categories:", error);
//       message.error("Failed to load categories");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCategoryChange = (category: string) => {
//     setSelectedCategory(category);
//     setFormData({});
//     setApiResponse(null);
//     form.resetFields();
//   };

//   const handleFieldChange = (fieldName: string, value: any) => {
//     setFormData(prev => ({
//       ...prev,
//       [fieldName]: value,
//     }));
//   };

//   const handleCalculate = async () => {
//     if (!selectedCategory) {
//       message.warning("Please select a category first");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const startTime = Date.now();

//       const response = await fetch("/api/calculate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           category: selectedCategory,
//           data: formData,
//         }),
//       });

//       const endTime = Date.now();
//       setResponseTime(endTime - startTime);

//       const result = await response.json();
//       setApiResponse(result);

//       if (result.success) {
//         message.success("Calculation completed successfully!");
//       } else {
//         message.error(result.message || "Calculation failed");
//       }
//     } catch (error) {
//       console.error("Error calculating emissions:", error);
//       message.error("Failed to calculate emissions");
//       setApiResponse({
//         success: false,
//         error: "Network error",
//         message: "Failed to connect to the API",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleRefreshForms = async () => {
//     try {
//       setIsLoading(true);
//       await refreshForms();
//       await loadCategories();
//       message.success("Forms refreshed successfully!");
//     } catch (error) {
//       message.error("Failed to refresh forms");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const selectedCategoryInfo = categories.find(
//     cat => cat.name === selectedCategory
//   );

//   const renderFormFields = () => {
//     if (!selectedCategoryInfo) return null;

//     return selectedCategoryInfo.allFields.map(field => (
//       <Form.Item
//         key={field.name}
//         label={
//           <Space>
//             <Text strong>{field.title}</Text>
//             {field.required && <Tag color="red">Required</Tag>}
//           </Space>
//         }
//         name={field.name}
//         rules={[
//           {
//             required: field.required,
//             message: `${field.title} is required`,
//           },
//         ]}
//         extra={
//           field.description && <Text type="secondary">{field.description}</Text>
//         }
//       >
//         <Input
//           placeholder={`Enter ${field.title.toLowerCase()}`}
//           onChange={e => handleFieldChange(field.name, e.target.value)}
//           size="large"
//         />
//       </Form.Item>
//     ));
//   };

//   const renderApiResponse = () => {
//     if (!apiResponse) return null;

//     const {
//       success,
//       data,
//       error,
//       message: responseMessage,
//       validationErrors,
//     } = apiResponse;

//     return (
//       <Card
//         title={
//           <Space>
//             <CodeOutlined />
//             <Text strong>API Response</Text>
//             <Badge
//               status={success ? "success" : "error"}
//               text={success ? "Success" : "Error"}
//             />
//             <Text type="secondary">({responseTime}ms)</Text>
//           </Space>
//         }
//         className="response-card"
//       >
//         {success ? (
//           <Alert
//             message="Calculation Successful"
//             description={responseMessage}
//             type="success"
//             icon={<CheckCircleOutlined />}
//             showIcon
//             style={{ marginBottom: 16 }}
//           />
//         ) : (
//           <Alert
//             message="Calculation Failed"
//             description={responseMessage || error}
//             type="error"
//             icon={<ExclamationCircleOutlined />}
//             showIcon
//             style={{ marginBottom: 16 }}
//           />
//         )}

//         {validationErrors && validationErrors.length > 0 && (
//           <Alert
//             message="Validation Errors"
//             description={
//               <ul>
//                 {validationErrors.map((error, index) => (
//                   <li key={index}>{error}</li>
//                 ))}
//               </ul>
//             }
//             type="warning"
//             style={{ marginBottom: 16 }}
//           />
//         )}

//         <Collapse>
//           <Panel header="Raw Response Data" key="1">
//             <TextArea
//               value={JSON.stringify(apiResponse, null, 2)}
//               rows={10}
//               readOnly
//               style={{ fontFamily: "monospace" }}
//             />
//           </Panel>
//         </Collapse>
//       </Card>
//     );
//   };

//   if (contextLoading || isLoading) {
//     return (
//       <div style={{ textAlign: "center", padding: "50px" }}>
//         <Spin size="large" />
//         <div style={{ marginTop: 16 }}>
//           <Text>Loading emission calculation forms...</Text>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="dynamic-api-tester">
//       <div className="header-section">
//         <Title level={2}>
//           <ApiOutlined style={{ marginRight: 8, color: "var(--primary-color)" }} />
//           Dynamic Emission Calculator API Tester
//         </Title>
//         <Paragraph type="secondary">
//           Test emission calculations using dynamic forms loaded from Firebase.
//           Select a category, fill in the required fields, and execute the
//           calculation.
//         </Paragraph>

//         <Space style={{ marginBottom: 24 }}>
//           <Button
//             icon={<ReloadOutlined />}
//             onClick={handleRefreshForms}
//             loading={isLoading}
//           >
//             Refresh Forms
//           </Button>
//           <Badge count={categories.length} showZero>
//             <Button icon={<InfoCircleOutlined />}>Available Categories</Button>
//           </Badge>
//         </Space>
//       </div>

//       <Row gutter={[24, 24]}>
//         <Col xs={24} lg={12}>
//           <Card
//             title={
//               <Space>
//                 <PlayCircleOutlined />
//                 <Text strong>Calculation Form</Text>
//               </Space>
//             }
//             className="form-card"
//           >
//             <Form form={form} layout="vertical" size="large">
//               <Form.Item label={<Text strong>Emission Category</Text>} required>
//                 <Select
//                   placeholder="Select an emission category"
//                   value={selectedCategory}
//                   onChange={handleCategoryChange}
//                   size="large"
//                 >
//                   {categories.map(category => (
//                     <Option key={category.name} value={category.name}>
//                       <Space>
//                         <Text strong>{category.title}</Text>
//                         <Text type="secondary">({category.name})</Text>
//                       </Space>
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>

//               {selectedCategoryInfo && (
//                 <>
//                   <Divider />
//                   <Alert
//                     message={selectedCategoryInfo.title}
//                     description={selectedCategoryInfo.description}
//                     type="info"
//                     showIcon
//                     style={{ marginBottom: 16 }}
//                   />

//                   {renderFormFields()}

//                   <Form.Item style={{ marginTop: 24 }}>
//                     <Button
//                       type="primary"
//                       size="large"
//                       icon={<PlayCircleOutlined />}
//                       onClick={handleCalculate}
//                       loading={isLoading}
//                       block
//                     >
//                       Calculate Emissions
//                     </Button>
//                   </Form.Item>
//                 </>
//               )}
//             </Form>
//           </Card>
//         </Col>

//         <Col xs={24} lg={12}>
//           {apiResponse ? (
//             renderApiResponse()
//           ) : (
//             <Card
//               title={
//                 <Space>
//                   <InfoCircleOutlined />
//                   <Text strong>Instructions</Text>
//                 </Space>
//               }
//               className="instructions-card"
//             >
//               <div className="instructions-content">
//                 <Paragraph>
//                   <Text strong>How to use this API tester:</Text>
//                 </Paragraph>
//                 <ol>
//                   <li>Select an emission category from the dropdown</li>
//                   <li>Fill in the required fields (marked with red tags)</li>
//                   <li>Click "Calculate Emissions" to execute the API call</li>
//                   <li>View the results in the response panel</li>
//                 </ol>

//                 <Divider />

//                 <Paragraph>
//                   <Text strong>Available Categories:</Text>
//                 </Paragraph>
//                 <Space wrap>
//                   {categories.map(category => (
//                     <Tag
//                       key={category.name}
//                       color="blue"
//                       style={{ marginBottom: 4 }}
//                     >
//                       {category.title}
//                     </Tag>
//                   ))}
//                 </Space>
//               </div>
//             </Card>
//           )}
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default DynamicApiTester;
