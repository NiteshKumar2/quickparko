import React from "react";
import {
  Box,
  Container,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import Image from "next/image";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" mt={1}>
      {"Quickparko © "}
      <Link href="https://Quickparko.com/" color="inherit" underline="hover">
        Quickparko
      </Link>{" "}
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
          {/* Logo & Description */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Image
              src="/logo.png"
              alt="Quickparko Logo"
              width={70}
              height={50}
            />
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

          {/* Links Sections */}
          <Stack
            direction={{ xs: "row", sm: "row" }}
            spacing={{ xs: 4, sm: 6 }}
            flex={2}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Users
              </Typography>
              <Stack spacing={0.5}>
                <Link color="text.secondary" href="#" underline="hover">
                  Find Parking
                </Link>
                <Link color="text.secondary" href="#" underline="hover">
                  Reservations
                </Link>
                <Link color="text.secondary" href="#" underline="hover">
                  Pricing
                </Link>
                <Link color="text.secondary" href="#" underline="hover">
                  FAQs
                </Link>
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Owners
              </Typography>
              <Stack spacing={0.5}>
                <Link color="text.secondary" href="#" underline="hover">
                  Manage Spot
                </Link>
                <Link color="text.secondary" href="#" underline="hover">
                  Earnings
                </Link>
                <Link color="text.secondary" href="#" underline="hover">
                  Analytics
                </Link>
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Legal
              </Typography>
              <Stack spacing={0.5}>
                <Link color="text.secondary" href="#" underline="hover">
                  Terms
                </Link>
                <Link color="text.secondary" href="#" underline="hover">
                  Privacy
                </Link>
                <Link color="text.secondary" href="#" underline="hover">
                  Contact
                </Link>
              </Stack>
            </Box>
          </Stack>
        </Stack>

        {/* Bottom Footer */}
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
            >
              <FacebookIcon fontSize="small" />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="Twitter"
              href="https://twitter.com/quickparko"
            >
              <TwitterIcon fontSize="small" />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="LinkedIn"
              href="https://www.linkedin.com/company/quickparko/"
            >
              <LinkedInIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
