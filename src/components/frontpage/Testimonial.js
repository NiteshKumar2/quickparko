"use client";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

const testimonials = [
  {
    name: "John Doe",
    review:
      "This parking app is amazing! Super easy to use and saves me so much time.",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Jane Smith",
    review: "Love the scanning feature! Makes entry and exit hassle-free.",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    name: "Michael Lee",
    review: "Very user-friendly and lightning fast. Highly recommended.",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    name: "Sarah Kim",
    review: "Great app for parking owners! The record book feature is awesome.",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    name: "David Chen",
    review: "Lightweight, fast, and works perfectly every time.",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
];

export default function Testimonials() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 2 } },
      { breakpoint: 1024, settings: { slidesToShow: 1 } }, // ✅ iPhone 13 & all phones
    ],
  };

  // Debug (optional)
  useEffect(() => {
    console.log("Screen width:", window.innerWidth);
  }, []);

  return (
    <Box
      sx={{
        px: { xs: 1, md: 40 },
        py: 8,
        background: "linear-gradient(to right, #f3f6f7, #eef2f5)",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 4, color: "#0d47a1" }}
      >
        What Our Users Say
      </Typography>

      <Slider {...settings}>
        {testimonials.map((t, index) => (
          <Box key={index} sx={{ px: 2 }}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 4,
                boxShadow: 4,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": { transform: "translateY(-6px)", boxShadow: 8 },
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 4 }}>
                <Avatar
                  src={t.avatar}
                  alt={t.name}
                  sx={{
                    width: 72,
                    height: 72,
                    mx: "auto",
                    mb: 2,
                    transition: "transform 0.3s ease",
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{ fontStyle: "italic", mb: 2, color: "#37474f" }}
                >
                  {t.review}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", color: "#0d47a1" }}
                >
                  — {t.name}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
