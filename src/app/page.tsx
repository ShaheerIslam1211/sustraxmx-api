"use client";

import CommonLayout from "../components/commonLayout";
import { useAuth } from "../context/AuthContext";
import { useEmissionData } from "../context/EmissionDataContext";

export default function Home() {
  const { user } = useAuth();
  const { emissionData } = useEmissionData();

  return (
    <CommonLayout>
      <div style={{ padding: "20px" }}>
        <h1>Welcome to Sustrax</h1>
        {user ? (
          <div>
            <h2>Hello, {user.displayName || user.email}!</h2>
            <p>Select an emission category from the sidebar to get started.</p>
            <div style={{ marginTop: "20px" }}>
              <h3>Available Emission Categories:</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "16px",
                  marginTop: "16px",
                }}
              >
                {Object.keys(emissionData).map(key => (
                  <div
                    key={key}
                    style={{
                      border: "1px solid #d9d9d9",
                      borderRadius: "8px",
                      padding: "16px",
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <h4>{emissionData[key].title}</h4>
                    <p style={{ color: "#666", fontSize: "14px" }}>
                      Click to calculate emissions for this category
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p>Please log in to access the emission calculation tools.</p>
          </div>
        )}
      </div>
    </CommonLayout>
  );
}
