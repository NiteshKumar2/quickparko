"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const settings = ["Profile", "Account", "Logout"];

function Navbar() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(8px)",
        boxShadow: "none",
        color: "#fff",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* ✅ Logo now redirects to homepage */}
          <Link href="/" passHref>
            <Box
              sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <Image
                src="/logo.png"
                alt="Quickparko Logo"
                width={55}
                height={45}
                priority
              />
            </Box>
          </Link>

          {/* Push rest to the right */}
          <Box sx={{ flexGrow: 1 }} />

          {!user ? (
            <Button
              onClick={() => signIn("google", { callbackUrl: "/account" })}
              variant="contained"
              sx={{
                backgroundColor: "#FF6F00",
                "&:hover": { backgroundColor: "#e65c00" },
              }}
            >
              Log In / Sign Up
            </Button>
          ) : (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: "#FF6F00" }}>
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      if (setting === "Logout") {
                        signOut({ callbackUrl: "/" });
                      } else if (setting === "Account") {
                        router.push("/account");
                      } else if (setting === "Profile") {
                        router.push("/profile");
                      }
                      handleCloseUserMenu();
                    }}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
