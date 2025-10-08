"use client";

import React from "react";
import { Card, Row, Col, Typography, Button, Space } from "antd";
import {
  PlayCircleOutlined,
  BarChartOutlined,
  ApiOutlined,
} from "@ant-design/icons";
import { AppLayout } from "../components";
import { useAuth, useEmissionData } from "../context";
import { EMISSION_CATEGORIES } from "../lib/constants";
import { logger } from "../lib/logger";
import "./page.css";

const { Title, Paragraph, Text } = Typography;

export default function Home() {
  const { user } = useAuth();
  const { emissionData } = useEmissionData();

  const handleCategoryClick = (categoryKey: string) => {
    logger.info("Category selected", {
      component: "HomePage",
      category: categoryKey,
      userId: user?.uid,
    });
    // Navigate to category page
    window.location.href = `/form/${categoryKey}`;
  };

  const handleGetStarted = () => {
    logger.info("Get started clicked", {
      component: "HomePage",
      userId: user?.uid,
    });
    // Navigate to first available category
    const firstCategory = Object.keys(emissionData)[0];
    if (firstCategory) {
      window.location.href = `/form/${firstCategory}`;
    }
  };

  return (
    <AppLayout>
      <div className="home-page">
        <div className="home-hero">
          <Title level={1} className="home-title">
            Welcome to SustraxMX API Playground
          </Title>
          <Paragraph className="home-description">
            An interactive platform for testing and exploring emission
            calculation APIs. Calculate your carbon footprint with precision and
            ease.
          </Paragraph>

          {user ? (
            <Space size="large" className="home-actions">
              <Button
                type="primary"
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
              <Button size="large" icon={<BarChartOutlined />} href="/api-test">
                API Testing
              </Button>
            </Space>
          ) : (
            <Space size="large" className="home-actions">
              <Button type="primary" size="large" href="/login">
                Sign In
              </Button>
              <Button size="large" href="/register">
                Sign Up
              </Button>
            </Space>
          )}
        </div>

        {user && (
          <div className="home-content">
            <Title level={2}>Available Emission Categories</Title>
            <Paragraph>
              Choose from our comprehensive list of emission calculation
              categories:
            </Paragraph>

            <Row gutter={[16, 16]} className="categories-grid">
              {Object.entries(emissionData).map(([key, category]) => {
                const categoryConfig = EMISSION_CATEGORIES[key];
                return (
                  <Col xs={24} sm={12} lg={8} xl={6} key={key}>
                    <Card
                      hoverable
                      className="category-card"
                      onClick={() => handleCategoryClick(key)}
                      cover={
                        <div className="category-icon">
                          <img
                            src={`/images/${categoryConfig?.icon || "custom.png"}`}
                            alt={category.title}
                            className="category-icon-image"
                          />
                        </div>
                      }
                    >
                      <Card.Meta
                        title={category.title}
                        description={
                          <div>
                            <Text
                              type="secondary"
                              className="category-description"
                            >
                              {categoryConfig?.description ||
                                "Calculate emissions for this category"}
                            </Text>
                            <div className="category-fields">
                              <Text
                                type="secondary"
                                className="category-fields-text"
                              >
                                Fields: {category.texts.length}
                              </Text>
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>
        )}

        <div className="home-features">
          <Title level={2}>Key Features</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className="feature-card">
                <ApiOutlined className="feature-icon" />
                <Title level={4}>Interactive API Testing</Title>
                <Paragraph>
                  Test all SustraxMX endpoints with our intuitive interface.
                  Generate code snippets in multiple languages.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="feature-card">
                <BarChartOutlined className="feature-icon" />
                <Title level={4}>Smart Form Generation</Title>
                <Paragraph>
                  Dynamic forms that adapt based on your selections. Real-time
                  validation and intelligent field suggestions.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="feature-card">
                <PlayCircleOutlined className="feature-icon" />
                <Title level={4}>Real-time Results</Title>
                <Paragraph>
                  Get instant emission calculations with detailed breakdowns.
                  Export results in multiple formats.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </AppLayout>
  );
}
