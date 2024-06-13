import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context";
import api from "../api";
import {
  Box,
  Typography,
  Avatar,
  InputBase,
  IconButton,
  Modal,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Icon
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SubdirectoryArrowRightSharpIcon from "@mui/icons-material/SubdirectoryArrowRightSharp";
import DeleteIcon from "@mui/icons-material/Delete";

const UserGroup = () => {
  const [group, setGroup] = useState([]);
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberId, setMemberId] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);


  const appContext = useContext(AppContext);
  const { user } = appContext;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleGroupNameChange = (e) => setGroupName(e.target.value);
  const handleGroupDescriptionChange = (e) => setGroupDescription(e.target.value);
  const handleMemberIdChange = (e) => setMemberId(e.target.value);
  const handleMemberEmailChange = (e) => setMemberEmail(e.target.value);

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
  };

  const handleAddMember = () => {
    setMembers([...members, { gmail: memberEmail, id: memberId, role: "member" }]);
    setMemberEmail("");
    setMemberId("");
  };

  const handleRemoveMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleCreateGroup = async () => {
    try {
      const groupData = {
        name: groupName,
        createAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        idOwner: user.id,
        describe: groupDescription,
        members: [
          {
            gmail: memberEmail,
            id: memberId,
            role: "member",
          },
          ...members,
        ],
      };

      const res = await api.post(`https://samnote.mangasocial.online/group/create/${user.id}`, groupData);
      setGroup([...group, res.data]);
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const getGroup = async () => {
      try {
        const res = await api.get(`https://samnote.mangasocial.online/group/all/${user.id}`);
        setGroup(res.data.data);
        console.log(res.data.data)
      } catch (err) {
        console.error(err);
      }
    };

    getGroup();
  }, [user.id]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "40% 60%",
      }}
    >
      <Box
        sx={{
          backgroundColor: "bgitem.main",
          paddingTop: "10px",
          height: "635px",
        }}
      >
        <Box
          sx={{
            color: "text.main",
            boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.5)",
            paddingLeft: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontWeight: "700",
              fontSize: "20px",
              padding: "10px 10px 20px",
            }}
          >
            Chat
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              component="form"
              sx={{
                backgroundColor: "#DADADA",
                display: "flex",
                alignItems: "center",
                height: "40px",
                width: "100%",
                borderRadius: "30px",
                margin: "0 10px 10px 0px",
              }}
            >
              <SearchIcon sx={{ marginLeft: "15px", color: "#333" }} />
              <InputBase
                sx={{ ml: 1, flex: 1, color: "#333" }}
                placeholder="Search Messenger"
                inputProps={{ "aria-label": "search google maps" }}
              />
            </Box>
          </div>
        </Box>
        <Accordion>
          <AccordionSummary
            expandIcon={<AddIcon sx={{ cursor: "pointer" }} onClick={handleOpen} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <ExpandMoreIcon />
            <Typography>Chat</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                maxHeight: "400px",
                overflowY: "auto",  // Add scroll
              }}>
              {group?.map((item, index) => {
                if (item.numberMems === 1) {
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        margin: "20px",
                        color: "text.main",
                        "&:hover": {
                          backgroundColor: "#BFEFFF", // Change to desired hover color
                          cursor: "pointer",
                        },
                      }}
                      onClick={() => handleGroupClick(item)}
                    >
                      <Avatar src="../public/groupImg.png" sx={{ width: "30px", height: "30px", margin: "20px" }} />
                      <div style={{ width: "100%" }} >
                        <strong>{item.name}</strong>
                        <p
                          style={{
                            padding: 0,
                            margin: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.describe}
                        </p>
                      </div>
                    </Box>
                  );
                } else {
                  return null; // Don't render if numberMems is not greater than 1
                }
              })}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<AddIcon sx={{ cursor: "pointer" }} onClick={handleOpen} />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <ExpandMoreIcon />
            <Typography>Group</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                maxHeight: "400px",
                overflowY: "auto",  // Add scroll
              }}
            >
              {group?.map((item, index) => {
                if (item.numberMems > 1) {
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        margin: "20px",
                        color: "text.main",
                        "&:hover": {
                          backgroundColor: "#BFEFFF", // Change to desired hover color
                          cursor: "pointer",
                        },
                      }}
                      onClick={() => handleGroupClick(item)}
                    >
                      <Avatar src="../public/groupImg.png" sx={{ width: "30px", height: "30px", margin: "20px" }} />
                      <div style={{ width: "100%" }} >
                        <strong>{item.name}</strong>
                        <p
                          style={{
                            padding: 0,
                            margin: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.describe}
                        </p>
                      </div>
                    </Box>
                  );
                } else {
                  return null; // Don't render if numberMems is not equal to 1
                }
              })}
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>

      <div style={{ borderLeft: "1px solid black" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px",
            color: "text.main",
            backgroundColor: "bg.main",
          }}
        >
          <div style={{ display: "flex" }}>
            <Avatar
              style={{
                height: "40px",
                width: "40px",
                marginRight: "15px",
              }}
              src="../public/groupImg.png"
              alt=""
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>
              {selectedGroup && (
                <>
                  <h3 style={{ margin: 0 }}>{selectedGroup.name}</h3>
                  <p style={{ margin: 0 }}>{selectedGroup.describe}</p>
                </>
              )}
            </div>
          </div>
          <MoreHorizIcon />
        </Box>
        <Box
          sx={{
            backgroundColor: "bgitem.main",
            height: "515px",
            overflow: "scroll",
            scrollbarWidth: "none",
          }}
        >
          <div
            style={{
              padding: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                height: "30px",
                width: "30px",
                marginRight: "5px",
              }}
              src="../public/img/avata.jpg"
              alt=""
            />
            <Box
              className="content-messenger-left"
              sx={{
                height: "fit-content",
                width: "fit-content",
                backgroundColor: "bgmessenger.main",
                textAlign: "left",
                padding: "0px 15px 0",
                borderRadius: "10px",
                margin: 0,
              }}
            >
              <p>nội dung tin nhắn</p>
            </Box>
          </div>
          <div
            style={{
              padding: "10px",
              display: "flex",
              alignItems: "center",
              flexDirection: "row-reverse",
            }}
          >
            <Avatar
              sx={{
                height: "30px",
                width: "30px",
                margin: "5px",
              }}
              src="../public/img/avata.jpg"
              alt=""
            />
            <Box
              className="content-messenger-left"
              sx={{
                height: "fit-content",
                width: "fit-content",
                backgroundColor: "mymes.main",
                color: "#fff",
                textAlign: "right",
                padding: "0px 15px 0",
                borderRadius: "10px",
                margin: 0,
              }}
            >
              <p>nội dung tin nhắn</p>
            </Box>
          </div>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#FFFFFF",
            height: "60px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "80%",
              padding: "10px 10px 0 10px",
              backgroundColor: "#F4F4F4",
              borderRadius: "15px",
              margin: "0 10px",
            }}
          >
            <IconButton sx={{ p: "10px" }}>
              <EmojiEmotionsIcon />
            </IconButton>
            <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Aa" />
            <IconButton sx={{ p: "10px" }}>
              <AttachFileIcon />
            </IconButton>
          </Box>
          <IconButton
            color="primary"
            sx={{ p: "10px" }}
            aria-label="directions"
          >
            <SubdirectoryArrowRightSharpIcon sx={{ cursor: "pointer" }} />
          </IconButton>
        </Box>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create Group
          </Typography>
          <TextField
            fullWidth
            label="Group Name"
            variant="outlined"
            margin="normal"
            value={groupName}
            onChange={handleGroupNameChange}
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            margin="normal"
            value={groupDescription}
            onChange={handleGroupDescriptionChange}
          />
          <List>
            {members.map((member, index) => (
              <ListItem key={index}>
                <ListItemText primary={member.gmail} secondary={member.role} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleRemoveMember(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <TextField
              label="Member Email"
              value={memberEmail}
              onChange={handleMemberEmailChange}
              fullWidth
            />
            <TextField
              label="Member ID"
              value={memberId}
              onChange={handleMemberIdChange}
              fullWidth
            />
            <IconButton onClick={handleAddMember}>
              <AddIcon />
            </IconButton>
          </Box>
          <Box sx={{ mt: 3, textAlign: "right" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateGroup}
            >
              Create
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default UserGroup;
