import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import EventNoteIcon from "@mui/icons-material/EventNote";
import GroupIcon from "@mui/icons-material/Group";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { handleLogOut } from "../helper";
import { AppContext } from "../context";

const navbarItems = [
  {
    name: "Home Page",
    icon: <HomeIcon />,
    url: "/",
  },
  {
    name: "Photos",
    icon: <PhotoLibraryIcon />,
    url: "/user/photo",
  },
  {
    name: "Note",
    icon: <EventNoteIcon />,
    url: "/user/note",
  },
  {
    name: "Group",
    icon: <GroupIcon />,
    url: "/user/group",
  },
  {
    name: "Dustbin",
    icon: <DeleteIcon />,
    url: "/user/dustbin",
  },
  {
    name: "Sketch",
    icon: <DriveFileRenameOutlineIcon />,
    url: "/user/sketch",
  },
];

const UserPanel = () => {
  const appContext = useContext(AppContext);
  const { user, setUser, setSnackbar } = appContext;
  const navigate = useNavigate();

  return (
    <>
      {user && (
        <Box
          // className="flex pl-[320px]"
          className="grid"
          style={{ gridTemplateColumns: "250px 1fr" }}
        >
          <Box
            // className={`w-[320px] min-h-screen bg-[#1D1D1D] text-white p-8 fixed top-0 left-0`}
            className={`w-[250px] min-h-screen bg-[#1D1D1D] text-white p-8 `}
          >
            <Box className="flex items-center justify-between mb-10">
              <Box
                className="flex gap-3 items-center cursor-pointer"
                onClick={() => navigate(`/user/profile`)}
              >
                <img
                  src={user.AvtProfile}
                  alt=""
                  className="rounded-full w-12"
                />
                <Typography className="text-2xl">{user.name}</Typography>
              </Box>
              <SettingsIcon
                fontSize="large"
                className="cursor-pointer"
                onClick={() => navigate(`/user/setting`)}
              />
            </Box>

            <Box className="flex items-end text-white mb-10">
              <SearchIcon className="mr-1 my-1" />
              <TextField
                id="input-with-sx"
                label="Search messenger"
                variant="standard"
                sx={{ input: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              />
            </Box>

            <Box>
              <Button
                variant="contained"
                className="bg-[#5BE260] rounded-full w-full mb-12"
                onClick={() => navigate(`/user/create-note`)}
              >
                <NoteAddIcon className="text-blue-500" />
                <Typography>new</Typography>
              </Button>
            </Box>

            <Box className="flex flex-col gap-4">
              {navbarItems.map((item, idx) => (
                <Box
                  key={idx}
                  className="flex gap-1 text-xl cursor-pointer"
                  onClick={() => navigate(item.url)}
                >
                  {item.icon}
                  <Typography>{item.name}</Typography>
                </Box>
              ))}
            </Box>
            <Button
              variant="contained"
              className="bg-red-500 w-full rounded-full mt-4"
              onClick={() => {
                const submit = confirm("Do you want to logout?");
                if (submit) {
                  setUser(null);
                  handleLogOut();
                }
              }}
            >
              Logout
            </Button>
          </Box>
          <Outlet />
        </Box>
      )}
    </>
  );
};

export default UserPanel;
