// import React, { useState, useEffect } from "react";
// import { Row, Col, Button, Input } from "antd";
// import { useAuth } from "../../context/AuthContext";
// import Loader from "../../components/common/antdSpin";
// import { useResponsive } from "../../customHooks/responsive";
// import "./index.css";
// import { Helmet } from "react-helmet";
// import texts from "../../mockData/texts";
// import { CustomInput } from "../common/formInputs/formInput";
// import CustomTabs from "../common/customTabs/CustomTab";

// const UserProfile = () => {
//   const { user } = useAuth();
//   const [activeTab, setActiveTab] = useState("user");
//   const [firstName, setFirstName] = useState("");
//   const [email, setEmail] = useState("");
//   const [isFormEdited, setIsFormEdited] = useState(false);
//   const { isMobile } = useResponsive();

//   useEffect(() => {
//     if (user) {
//       setFirstName(user.displayName || "");
//       setEmail(user.email || "");
//     }
//   }, [user]);

//   const onInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "firstName") {
//       setFirstName(value);
//     } else if (name === "email") {
//       setEmail(value);
//     }
//     setIsFormEdited(true);
//   };

//   if (!user) {
//     return <Loader />;
//   }

//   const tabsData = [
//     {
//       key: "user",
//       label: "User",
//       content: (
//         <section>
//           <div className="profile-input">
//             <div style={{ paddingBottom: "20px" }}>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <h4 id="responsive">{texts.profile.userName.nameTitle}</h4>
//                 <CustomInput
//                   type="text"
//                   name="firstName"
//                   value={firstName}
//                   onChange={onInputChange}
//                 />
//               </div>
//               <p>{texts.profile.userName.exampleName}</p>
//             </div>
//             <div label="Email">
//               <div
//                 className="email"
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <h4 id="responsive">{texts.profile.userEmail.emailTitle}</h4>
//                 <CustomInput
//                   type="email"
//                   name="email"
//                   value={email}
//                   onChange={onInputChange}
//                   style={{ width: "400px" }}
//                 />
//               </div>
//               <p>{texts.profile.userEmail.exampleEmail}</p>
//             </div>
//           </div>
//           <footer>
//             <Button
//               style={{ marginTop: "20px" }}
//               type="primary"
//               disabled={!isFormEdited}
//             >
//               {texts.profile.updateBtnTxt}
//             </Button>
//           </footer>
//         </section>
//       ),
//     },
//     {
//       key: "password",
//       label: "Password",
//       content: (
//         <section>
//           <div className="password-input">
//             <div style={{ paddingBottom: "20px" }}>
//               <h4 id="responsive">{texts.profile.newPassword}</h4>
//               <Input.Password style={{ width: "400px" }} />
//             </div>
//             <div label="Confirm New Password">
//               <h4 id="responsive">{texts.profile.confirmNewPassword}</h4>
//               <Input.Password style={{ width: "400px" }} />
//             </div>
//           </div>
//           <footer>
//             <Button style={{ marginTop: "20px" }} type="primary">
//               {texts.profile.updateBtnTxt}
//             </Button>
//           </footer>
//         </section>
//       ),
//     },
//   ];

//   return (
//     <article className="profileMainContainer">
//       <Helmet>
//         <title>Profile - {firstName || "User"}</title>
//         <meta
//           name="description"
//           content={`View and edit profile for ${
//             firstName || "user"
//           }. Update your details like name, email, and password.`}
//         />
//       </Helmet>
//       <Row>
//         <Col xs={24} md={18}>
//           <header>
//             <h1 className="profile-title">{texts.profile.profileTitle}</h1>
//           </header>
//           <CustomTabs
//             activeKey={activeTab}
//             onChange={setActiveTab}
//             tabsData={tabsData}
//           />
//         </Col>
//       </Row>
//     </article>
//   );
// };

// export default UserProfile;
