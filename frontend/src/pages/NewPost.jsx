import React from "react";
import {Box} from "@mui/material";
import SimpleEditor from "../components/SimpleEditor";

export default function NewPost() {
  return (
    <>
      {/* Rich Text Editor */}
      <Box>
        <SimpleEditor />
      </Box>
    </>
  );
}
