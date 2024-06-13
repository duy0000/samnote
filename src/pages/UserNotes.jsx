import EditNoteIcon from "@mui/icons-material/EditNote";
import { Editor } from "@tinymce/tinymce-react";
import { useState, useContext, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { SketchPicker } from "react-color";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api";
import { AppContext } from "../context";
import { format } from "date-fns";

const notePublicOptions = ["Private", "public"];

export default function UserNotes() {
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [idFolder, setIdFolder] = useState(null);
  const [dueAt, setDueAt] = useState(null);
  const [pinned, setPinned] = useState(false);
  const [lock, setLock] = useState("");
  const [remindAt, setRemindAt] = useState(null);
  const [data, setData] = useState("");
  const [notePublic, setNotePublic] = useState(0);
  const [color, setColor] = useState({ r: "255", g: "255", b: "255", a: "1" });
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [folder, setUserFolder] = useState([]);
  const [note, setUserNote] = useState([]);
  const [noteEdit, setNoteEdit] = useState(null);

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
  }, [user.id]);

  useEffect(() => {
    let ignore = false;
    const getUserNote = async () => {
      try {
        const res = await api.get(
          `https://samnote.mangasocial.online/notes/${user.id}`
        );
        if (!ignore) {
          setUserNote(res.data.notes);
          console.log(res.data.notes);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getUserNote();

    return () => {
      ignore = true;
    };
  }, [user.id]);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChangeColor = (color) => {
    setColor(color.rgb);
  };

  const handleChangeNotePublic = (e) => {
    setNotePublic(e.target.value);
  };

  const handleEditorChange = (content, editor) => {
    setData(content);
  };

  const handleSubmit = async () => {
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
      idFolder,
      dueAt: dueAt ? dueAt.toISOString() : null,
      pinned,
      lock,
      remindAt: outputDate ? outputDate : null,
      linkNoteShare: "",
      notePublic,
    };

    try {
      await api.post(`/notes/${user.id}`, payload);
      setSnackbar({
        isOpen: true,
        message: "Update note successfully",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        isOpen: true,
        message: "Failed to update note",
        severity: "error",
      });
    }
  };

  const handleGetValue = (info) => {
    setNoteEdit(info);
    setType(info.type);
    setTitle(info.title);
    setIdFolder(info.idFolder);
    setDueAt(info.dueAt);
    setPinned(info.pinned);
    setLock(info.lock);
    setRemindAt(new Date(info.remindAt));
    setData(info.data);
    setNotePublic(info.notePublic);
    setColor(info.color);
  };
  console.log("noteEdit", noteEdit);
  return (
    <Box className="grid grid-cols-[350px_1fr]">
      <div className="mx-3 overflow-y-auto h-[100vh]">
        <Box className="flex justify-between items-center mt-3">
          <div className="flex">
            <EditNoteIcon />
            <p className="m-0 p-0">Edit Note</p>
          </div>
        </Box>
        {note &&
          note.map((info, index) => (
            <div
              key={index}
              className="my-3 p-3 rounded-xl"
              style={{
                border: "1px solid #000",
                backgroundColor: `rgba(${info.color.r}, ${info.color.g}, ${info.color.b}, ${info.color.a})`,
              }}
              onClick={() => handleGetValue(info)}
            >
              <h4>{info.title}</h4>
              <div dangerouslySetInnerHTML={{ __html: info.data }} />
            </div>
          ))}
      </div>
      {noteEdit === null ? (
        <h3>Click any note to edit</h3>
      ) : (
        <Box className="max-w mx-auto mt-3">
          <div className="flex justify-end items-center mr-3">
            <Button className="h-8" variant="contained" onClick={handleSubmit}>
              Save
            </Button>
          </div>

          <Box className="flex flex-wrap">
            <FormControl className="w-full sm:w-1/3 mx-2 my-2">
              <TextField
                id="demo-simple-select"
                label="Type"
                size="small"
                value={type}
              />
            </FormControl>
            <TextField
              className="w-full sm:w-1/3 mx-2 my-2"
              label="Title"
              size="small"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div
              className="w-full sm:w-1/3 mx-2 my-2"
              style={{
                padding: "5px",
                background: "#fff",
                borderRadius: "3px",
                boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
                cursor: "pointer",
                display: "flex",
                height: "39px",
                whiteSpace: "nowrap",
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
                  background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
                }}
              />
            </div>
            {displayColorPicker && (
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
                <SketchPicker color={color} onChange={handleChangeColor} />
              </div>
            )}

            <FormControl className="w-full sm:w-1/3 mx-2 my-2">
              <Select
                label="Folder"
                size="small"
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
              className="w-full sm:w-1/3 mx-2 my-2"
              label="Lock"
              size="small"
              type="password"
              value={lock === null ? "" : lock}
              onChange={(e) => setLock(e.target.value)}
            />

            <FormControl className="w-full sm:w-1/3 mx-2 my-2">
              <Select
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
            <Box className="flex items-center w-full sm:w-1/2 z-50 mx-2 my-2">
              <h6>RemindAt:</h6>{" "}
              <DatePicker
                selected={remindAt}
                onChange={(date) => setRemindAt(date)}
                showTimeSelect
                dateFormat="Pp"
              />
            </Box>
            <FormControlLabel
              className="w-full sm:w-1/2 mx-2 my-2"
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
                  value={data}
                  init={{
                    height: "100vh",
                    menubar: true,
                    statusbar: false,
                    toolbar:
                      "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat",
                  }}
                  onEditorChange={handleEditorChange}
                />
              </div>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
