import React from "react";
import {
  Container,
  Box,
  TextField,
  ImageList,
  ImageListItem,
  IconButton,
  Snackbar,
} from "@mui/material";
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

interface MosaicProps {}
interface MosaicState {
  isUploading: boolean;
  isDownloading: boolean;
  hasError: boolean;
  emojiName: string;
  imageData: {
    imageParts: Array<string>;
    imageWidth: number;
  };
}

export default class Mosaic extends React.Component<MosaicProps, MosaicState> {
  constructor(props: MosaicProps) {
    super(props);

    this.state = {
      isUploading: false,
      isDownloading: false,
      hasError: false,
      emojiName: "",
      imageData: { imageParts: [], imageWidth: 0 },
    };

    this.uploadImage = this.uploadImage.bind(this);
    this.downloadImages = this.downloadImages.bind(this);
    this.handleEmojiNameChange = this.handleEmojiNameChange.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleErrorClose = this.handleErrorClose.bind(this);
  }

  render() {
    const renderedImages = [];
    const { emojiName, isUploading, hasError } = this.state;
    const { imageParts, imageWidth } = this.state.imageData;

    for (var i = 0; i < imageParts.length; i++) {
      renderedImages.push(
        <ImageListItem key={`${emojiName}-${i + 1}`}>
          <img
            src={`data:image/png;base64,${imageParts[i]}`}
            alt={`${emojiName}-${i + 1}`}
          />
        </ImageListItem>
      );
    }

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
          {imageParts.length === 0 ? (
            <label htmlFor="contained-button-file">
              <input
                hidden
                accept="image/*"
                id="contained-button-file"
                type="file"
                onChange={this.uploadImage}
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
              cols={imageWidth}
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
              onClick={this.handleErrorClose}
            >
              <Close fontSize="small" />
            </IconButton>
          }
          open={hasError}
          onClose={this.handleErrorClose}
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
            onChange={this.handleEmojiNameChange}
            disabled={imageParts.length === 0}
          />

          {/* Download Button */}
          <IconButton
            color="primary"
            onClick={this.downloadImages}
            disabled={imageParts.length === 0}
          >
            <Download aria-label="download" />
          </IconButton>

          {/* Copy Formatted Text */}
          <IconButton
            color="secondary"
            onClick={this.handleCopy}
            disabled={imageParts.length === 0}
          >
            <ContentCopy aria-label="copy-formatted-text" />
          </IconButton>
        </Box>

        {/* Clear */}
        {imageParts.length !== 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", pt: 3 }}>
            <IconButton
              color="error"
              onClick={this.handleClear}
              disabled={imageParts.length === 0}
            >
              <Clear area-label="clear-page" />
            </IconButton>
          </Box>
        ) : null}
      </Container>
    );
  }

  async uploadImage(event: React.FormEvent<HTMLInputElement>) {
    if (event.currentTarget.files === null) {
      return;
    }

    this.setState({
      isUploading: true,
      emojiName: event.currentTarget.files[0].name.split(".")[0],
    });

    try {
      var response = await axios.put(
        `https://14b8zg5490.execute-api.us-west-2.amazonaws.com/`,
        event.currentTarget.files[0]
      );

      this.setState({
        imageData: response.data.imageData,
        isUploading: false,
      });
    } catch (e) {
      this.setState({
        emojiName: "",
        hasError: true,
        isUploading: false,
      });
    }
  }

  async downloadImages() {
    this.setState({
      isDownloading: true,
    });

    const { emojiName: emojiNameState } = this.state;
    const { imageParts } = this.state.imageData;

    const zip = new JSZip();
    const emojiZip = zip.folder(emojiNameState);
    const emojiName = emojiNameState === "" ? "emoji" : emojiNameState;

    for (var i = 0; i < imageParts.length; i++) {
      emojiZip?.file(`${emojiName}-${i + 1}.png`, imageParts[i], {
        base64: true,
      });

      this.setState({
        isDownloading: false,
      });
    }

    const archive = await zip.generateAsync({ type: "blob" });
    saveAs(archive, emojiName);
  }

  handleEmojiNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      emojiName: event.currentTarget.value,
    });
  }

  handleCopy() {
    var formattedText = "";
    const { emojiName: emojiNameState } = this.state;
    const { imageParts, imageWidth } = this.state.imageData;

    const emojiName = emojiNameState === "" ? "emoji" : emojiNameState;
    const breakpoint = imageWidth;

    for (var i = 0; i < imageParts.length; i++) {
      formattedText += `:${emojiName}-${i + 1}:`;
      if ((i + 1) % breakpoint === 0) {
        formattedText += "\n";
      }
    }
    navigator.clipboard.writeText(formattedText);
  }

  handleClear() {
    this.setState({
      emojiName: "",
      imageData: { imageParts: [], imageWidth: 0 },
    });
  }

  handleErrorClose() {
    this.setState({
      hasError: false,
    });
  }
}
