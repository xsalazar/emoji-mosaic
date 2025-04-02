import React, { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Download,
  Upload,
  ContentCopy,
  Clear,
  Close,
} from "@mui/icons-material";
import saveAs from "file-saver";
import JSZip from "jszip";
import axios from "axios";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import ImageListItem from "@mui/material/ImageListItem";

export default function Mosaic() {
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [emojiName, setEmojiName] = useState("");
  const [imageData, setImageData] = useState<{
    imageParts: Array<string>;
    imageWidth: number;
  }>({ imageParts: [], imageWidth: 0 });

  const renderedImages = [];

  for (var i = 0; i < imageData.imageParts.length; i++) {
    renderedImages.push(
      <ImageListItem key={`${emojiName}-${i + 1}`}>
        <img
          src={`data:image/png;base64,${imageData.imageParts[i]}`}
          alt={`${emojiName}-${i + 1}`}
        />
      </ImageListItem>
    );
  }

  const uploadImage = async (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.files === null) {
      return;
    }

    setIsUploading(true);
    setEmojiName(event.currentTarget.files[0].name.split(".")[0]);

    try {
      var response = await axios.put(
        `https://14b8zg5490.execute-api.us-west-2.amazonaws.com/`,
        event.currentTarget.files[0]
      );

      setImageData(response.data.imageData);
      setIsUploading(false);
    } catch (e) {
      setEmojiName("");
      setHasError(true);
      setIsUploading(false);
    }
  };

  const downloadImages = async () => {
    setIsDownloading(true);

    const zip = new JSZip();
    const emojiZip = zip.folder(emojiName);
    const emojiNameOutput = emojiName === "" ? "emoji" : emojiName;

    for (var i = 0; i < imageData.imageParts.length; i++) {
      emojiZip?.file(
        `${emojiNameOutput}-${i + 1}.png`,
        imageData.imageParts[i],
        {
          base64: true,
        }
      );

      setIsDownloading(false);
    }

    const archive = await zip.generateAsync({ type: "blob" });
    saveAs(archive, emojiName);
  };

  const handleEmojiNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmojiName(event.currentTarget.value);
  };

  const handleCopy = () => {
    var formattedText = "";

    const emojiNameOutput = emojiName === "" ? "emoji" : emojiName;
    const breakpoint = imageData.imageWidth;

    for (var i = 0; i < imageData.imageParts.length; i++) {
      formattedText += `:${emojiNameOutput}-${i + 1}:`;
      if ((i + 1) % breakpoint === 0) {
        formattedText += "\n";
      }
    }
    navigator.clipboard.writeText(formattedText);
  };

  const handleClear = () => {
    setEmojiName("");
    setImageData({ imageParts: [], imageWidth: 0 });
  };

  const handleErrorClose = () => {
    setHasError(false);
  };

  return (
    <Container maxWidth="sm" sx={{ flexGrow: 1 }}>
      {/* Upload / Display */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "440px",
          pb: 2,
        }}
      >
        {imageData.imageParts.length === 0 ? (
          <label htmlFor="contained-button-file">
            <input
              hidden
              accept="image/*"
              id="contained-button-file"
              type="file"
              onChange={uploadImage}
            />
            <LoadingButton
              variant="contained"
              component="span"
              loading={isUploading}
              startIcon={<Upload />}
              loadingPosition="start"
            >
              Upload Image
            </LoadingButton>
          </label>
        ) : (
          <ImageList
            sx={{ maxHeight: "440px" }}
            cols={imageData.imageWidth}
            gap={2}
            variant="quilted"
          >
            {renderedImages}
          </ImageList>
        )}
      </Box>

      {/* Error Toast */}
      <Snackbar
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleErrorClose}
          >
            <Close fontSize="small" />
          </IconButton>
        }
        open={hasError}
        onClose={handleErrorClose}
        autoHideDuration={4000}
        message="🙈 Uh oh, something went wrong -- sorry! Try again soon"
      />

      {/* Configuration / Download */}
      <Box sx={{ display: "flex", justifyContent: "center", pt: 3 }}>
        {/* Emoji Name */}
        <TextField
          id="standard-basic"
          label=":emoji-name:"
          variant="outlined"
          size="small"
          value={emojiName}
          onChange={handleEmojiNameChange}
          disabled={imageData.imageParts.length === 0}
        />

        {/* Download Button */}
        <IconButton
          color="primary"
          onClick={downloadImages}
          disabled={isDownloading || imageData.imageParts.length === 0}
        >
          <Download aria-label="download" />
        </IconButton>

        {/* Copy Formatted Text */}
        <IconButton
          color="secondary"
          onClick={handleCopy}
          disabled={imageData.imageParts.length === 0}
        >
          <ContentCopy aria-label="copy-formatted-text" />
        </IconButton>
      </Box>

      {/* Clear */}
      {imageData.imageParts.length !== 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 3 }}>
          <IconButton
            color="error"
            onClick={handleClear}
            disabled={imageData.imageParts.length === 0}
          >
            <Clear area-label="clear-page" />
          </IconButton>
        </Box>
      ) : null}
    </Container>
  );
}
