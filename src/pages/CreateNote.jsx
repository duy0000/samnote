import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";

import { useState, useContext, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import { SketchPicker } from "react-color";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api";
import { AppContext } from "../context";
import { format } from "date-fns";

const types = ["Text", "CheckList"];
const notePublicOptions = ["Private", "public"];
const CreateNote = () => {
  const [type, setType] = useState("Text");
  // const [data, setData] = useState("");
  const [title, setTitle] = useState("");
  const [idFolder, setIdFolder] = useState("");
  const [dueAt] = useState(null);
  const [pinned, setPinned] = useState(false);
  const [lock, setLock] = useState("");
  const [remindAt, setRemindAt] = useState(null);
  // const [linkNoteShare, setLinkNoteShare] = useState("");
  const [data, setData] = useState(null);

  const handleEditorChange = (data, editor) => {
    setData(data);
  };

  const linkNoteShare = null;
  const [notePublic, setNotePublic] = useState(0);
  const [color, setColor] = useState({ r: "255", g: "255", b: "255", a: "1" });
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [folder, setUserFolder] = useState(null);
  const appContext = useContext(AppContext);
  const { user, setSnackbar } = appContext;
  const outputDate = format(new Date(remindAt), "d/M/yyyy HH:mm a '+07:00'");
  useEffect(() => {
    let ignore = false;
    const getUserFolder = async () => {
      try {
        const res = await api.get(
          `https://samnote.mangasocial.online/allfolder/${user.id}`
        );
        if (!ignore) {
          setUserFolder(res.data.folder);
          console.log("User folder", res.data.folder);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getUserFolder();

    return () => {
      ignore = true;
    };
  }, []);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (color) => {
    setColor(color.rgb);
  };

  const handleChangeType = (e) => {
    setType(e.target.value);
  };

  const handleChangeNotePublic = (e) => {
    setNotePublic(e.target.value);
  };

  const handleSubmit = async () => {
    let idFolderNumber = idFolder;
    console.log(idFolderNumber);

    const parsedColor = {
      r: parseInt(color.r),
      g: parseInt(color.g),
      b: parseInt(color.b),
      a: parseInt(color.a),
    };

    const payload = {
      type,
      data,
      title,
      color: parsedColor,
      idFolder: idFolderNumber,
      dueAt: dueAt ? dueAt.toISOString() : null,
      pinned,
      lock,
      remindAt: outputDate ? outputDate : null,
      linkNoteShare: "",
      notePublic,
    };
    console.log(payload);
    try {
      await api.post(`/notes/${user.id}`, payload);
      setSnackbar({
        isOpen: true,
        message: "Created new note successfully",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        isOpen: true,
        message: "Failed to create note",
        severity: "error",
      });
    }
  };

  // Tình thời đi học vốn như tơ
  // Có hợp có tan chẳng bất ngờ
  // Nhưng sao ta vẫn không quên được
  // Để mãi bây giờ lại làm thơ
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <>
      {" "}
      <Box className="max-w mx-auto mt-3">
        <Box className="flex justify-between ">
          {" "}
          <h2 className="ml-2 mb-4 uppercase">create note</h2>
          <Button
            className="mt-2 mb-5 mr-4"
            variant="contained"
            onClick={handleSubmit}
          >
            Create
          </Button>
        </Box>

        <Box className="flex flex-wrap">
          <FormControl className="w-full md:w-1/3 lg:w-1/4 xl:w-1/4 mx-4 my-2">
            <InputLabel id="demo-simple-select-label">Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Type"
              size="small"
              value={type}
              onChange={handleChangeType}
            >
              {types.map((type, idx) => (
                <MenuItem key={idx} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            className="w-full md:w-1/3 lg:w-1/4 xl:w-1/4 mx-4 my-2"
            label="Title"
            size="small"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div
            className="w-full md:w-1/3 lg:w-1/4 xl:w-1/4 mx-4 my-2"
            style={{
              padding: "5px",
              background: "#fff",
              borderRadius: "3px",
              boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
              cursor: "pointer",
              display: "flex",
              height: "39px",
            }}
            onClick={handleClick}
          >
            Background-color:
            <div
              style={{
                width: "36px",
                height: "100%",
                border: "0.1px solid black",
                marginLeft: "5px",
                borderRadius: "2px",
                background: ` rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
              }}
            />
          </div>
          {displayColorPicker ? (
            <div
              style={{
                position: "absolute",
                right: "0px",
                zIndex: "50",
              }}
            >
              <div
                style={{
                  position: "fixed",
                  top: "0px",
                  right: "0px",
                  bottom: "0px",
                  left: "0px",
                }}
                onClick={handleClose}
              />
              <SketchPicker color={color} onChange={handleChange} />
            </div>
          ) : null}

          <FormControl className="w-full md:w-1/3 lg:w-1/4 xl:w-1/4 mx-4 my-2">
            <InputLabel id="demo-simple-select-folder">Folder</InputLabel>
            <Select
              label="folder"
              size="small"
              labelId="demo-simple-select-folder"
              id="demo-simple-select"
              value={idFolder}
              onChange={(e) => setIdFolder(e.target.value)}
            >
              {folder &&
                folder.map((data, index) => (
                  <MenuItem key={index} value={data.id}>
                    {data.nameFolder}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            className="w-full md:w-1/3 lg:w-1/4 xl:w-1/4 mx-4 my-2"
            label="Lock"
            size="small"
            type="password"
            value={lock}
            onChange={(e) => setLock(e.target.value)}
          />

          <FormControl className="w-full md:w-1/3 lg:w-1/4 xl:w-1/4 mx-4 my-2">
            <InputLabel id="demo-simple-select-label">Note Public</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              label="NotePublic"
              size="small"
              value={notePublic}
              onChange={handleChangeNotePublic}
            >
              {notePublicOptions.map((note, idx) => (
                <MenuItem key={idx} value={idx}>
                  {note}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box className="flex items-center w-full md:w-1/3 lg:w-1/4 xl:w-1/4 z-50 mx-4 my-2">
            <h6>RemindAt:</h6>{" "}
            <DatePicker
              selected={remindAt}
              onChange={(date) => setRemindAt(date)}
              showTimeSelect
              dateFormat="Pp"
            />
          </Box>
          <FormControlLabel
            className="w-full md:w-1/3 lg:w-1/4 xl:w-1/4  mx-4 my-2"
            label="Pinned"
            control={
              <Checkbox
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
              />
            }
          />
          <Box className="w-full">
            <h5 className="ml-2">Content</h5>
            <div>
              <Editor
                apiKey="c9fpvuqin9s9m9702haau5pyi6k0t0zj29nelhczdvjdbt3y"
                initialValue="<p>Write content here</p>"
                init={{
                  height: "100vh",
                  menubar: true,
                  statusbar: false,
                  toolbar:
                    "undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat ",
                }}
                onEditorChange={handleEditorChange}
              />
            </div>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default CreateNote;