import React from "react";
import {
  Box,
  Container,
  IconButton,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import Image from "next/image";
import Link from "next/link"; // ✅ For homepage redirect

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" mt={1}>
      {"Quickparko © "}
      <MuiLink href="https://quickparko.com/" color="inherit" underline="hover">
        Quickparko
      </MuiLink>{" "}
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "background.paper",
        py: { xs: 6, sm: 10 },
        px: { xs: 3, sm: 6, md: 12 },
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          spacing={{ xs: 6, sm: 4 }}
        >
          {/* ✅ Logo & Description (Clickable to homepage) */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Link href="/" passHref>
              <Box sx={{ cursor: "pointer", display: "inline-block" }}>
                <Image
                  src="/logo.png"
                  alt="Quickparko Logo"
                  width={70}
                  height={50}
                />
              </Box>
            </Link>
            <Typography
              variant="body2"
              color="text.secondary"
              mt={2}
              sx={{ maxWidth: 260 }}
            >
              Quickparko helps you find and manage parking spots seamlessly for
              a hassle-free experience.
            </Typography>
          </Box>

          {/* ✅ Links Sections */}
          <Stack
            direction={{ xs: "row", sm: "row" }}
            spacing={{ xs: 4, sm: 6 }}
            flex={2}
            justifyContent="space-between"
          >
            {/* Users */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Users
              </Typography>
              <Stack spacing={0.5}>
                <MuiLink color="text.secondary" href="/plans" underline="hover">
                  Subscription Plans
                </MuiLink>
                <MuiLink
                  color="text.secondary"
                  href="/history"
                  underline="hover"
                >
                  Parking History
                </MuiLink>
                <MuiLink
                  color="text.secondary"
                  href="/offers"
                  underline="hover"
                >
                  Offers & Discounts
                </MuiLink>
                <MuiLink color="text.secondary" href="/faqs" underline="hover">
                  FAQs
                </MuiLink>
              </Stack>
            </Box>

            {/* Owners */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Owners
              </Typography>
              <Stack spacing={0.5}>
                <MuiLink
                  color="text.secondary"
                  href="/manage-spot"
                  underline="hover"
                >
                  Manage Spot
                </MuiLink>
                <MuiLink
                  color="text.secondary"
                  href="/support"
                  underline="hover"
                >
                  Customer Support
                </MuiLink>
                <MuiLink
                  color="text.secondary"
                  href="/analytics"
                  underline="hover"
                >
                  Analytics
                </MuiLink>
              </Stack>
            </Box>

            {/* Legal */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Legal
              </Typography>
              <Stack spacing={0.5}>
                <MuiLink color="text.secondary" href="/terms" underline="hover">
                  Terms
                </MuiLink>
                <MuiLink
                  color="text.secondary"
                  href="/privacy"
                  underline="hover"
                >
                  Privacy
                </MuiLink>
                <MuiLink
                  color="text.secondary"
                  href="/contact"
                  underline="hover"
                >
                  Contact
                </MuiLink>
              </Stack>
            </Box>
          </Stack>
        </Stack>

        {/* ✅ Bottom Footer */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          mt={6}
          spacing={2}
        >
          <Copyright />

          <Stack direction="row" spacing={1}>
            <IconButton
              color="inherit"
              aria-label="Facebook"
              href="https://facebook.com/quickparko"
              target="_blank"
            >
              <FacebookIcon fontSize="small" />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="Twitter"
              href="https://twitter.com/quickparko"
              target="_blank"
            >
              <TwitterIcon fontSize="small" />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="LinkedIn"
              href="https://www.linkedin.com/company/quickparko/"
              target="_blank"
            >
              <LinkedInIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
