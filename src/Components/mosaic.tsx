import React from "react";
import {
  Container,
  Box,
  TextField,
  ImageList,
  ImageListItem,
  IconButton,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Download, Upload, ContentCopy } from "@mui/icons-material";
import saveAs from "file-saver";
import JSZip from "jszip";
import axios from "axios";

interface MosaicProps {}
interface MosaicState {
  isUploading: boolean;
  isDownloading: boolean;
  emojiName: string;
  imageParts: Array<string>;
}

export default class Mosaic extends React.Component<MosaicProps, MosaicState> {
  constructor(props: MosaicProps) {
    super(props);

    this.state = {
      isUploading: false,
      isDownloading: false,
      emojiName: "emoji",
      imageParts: [],
    };

    this.uploadImage = this.uploadImage.bind(this);
    this.downloadImages = this.downloadImages.bind(this);
    this.handleEmojiNameChange = this.handleEmojiNameChange.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
  }
  render() {
    const renderedImages = [];
    for (var i = 0; i < this.state.imageParts.length; i++) {
      renderedImages.push(
        <ImageListItem key={`${this.state.emojiName}-${i + 1}`}>
          <img
            src={this.state.imageParts[i]}
            alt={`${this.state.emojiName}-${i + 1}`}
          />
        </ImageListItem>
      );
    }

    return (
      <div style={{ height: "calc(100vh - 200px)" }}>
        <Container maxWidth="sm">
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
            {this.state.imageParts.length === 0 ? (
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
                  loading={this.state.isUploading}
                  startIcon={<Upload />}
                  loadingPosition="start"
                >
                  Upload Image
                </LoadingButton>
              </label>
            ) : (
              <ImageList
                sx={{ maxHeight: "440px" }}
                cols={7}
                gap={2}
                variant="quilted"
              >
                {renderedImages}
              </ImageList>
            )}
          </Box>

          {/* Configuration / Download */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <TextField
              id="standard-basic"
              label="emoji-name"
              variant="outlined"
              size="small"
              onChange={this.handleEmojiNameChange}
            />

            <IconButton
              onClick={this.downloadImages}
              disabled={this.state.imageParts.length === 0}
              color="primary"
            >
              <Download />
            </IconButton>
            <IconButton color="secondary" onClick={this.handleCopy}>
              <ContentCopy />
            </IconButton>
          </Box>
        </Container>
      </div>
    );
  }

  async uploadImage(event: React.FormEvent<HTMLInputElement>) {
    if (event.currentTarget.files === null) {
      return;
    }

    this.setState({
      isUploading: true,
    });

    var response = await axios.put(
      `https://14b8zg5490.execute-api.us-west-2.amazonaws.com/`,
      event.currentTarget.files[0]
    );

    this.setState({
      imageParts: response.data,
      isUploading: false,
    });
  }

  async downloadImages() {
    this.setState({
      isDownloading: true,
    });

    const zip = new JSZip();
    const emojiZip = zip.folder(this.state.emojiName);

    for (var i = 0; i < this.state.imageParts.length; i++) {
      var base64ImageString = this.state.imageParts[i];

      // Trim base64 metadata from string
      // data:image/png;base64,iVBORw0KGgo...
      var index = base64ImageString.indexOf(",");
      if (index !== -1) {
        base64ImageString = base64ImageString.substring(
          index + 1,
          base64ImageString.length
        );
      }

      emojiZip?.file(
        `${this.state.emojiName}-${i + 1}.png`,
        base64ImageString,
        { base64: true }
      );

      this.setState({
        isDownloading: false,
      });
    }

    const archive = await zip.generateAsync({ type: "blob" });
    saveAs(archive, this.state.emojiName);
  }

  handleEmojiNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.currentTarget.value === "") {
      this.setState({
        emojiName: "emoji",
      });
    }

    this.setState({
      emojiName: event.currentTarget.value,
    });
  }

  handleCopy() {
    var formattedText = "";

    for (var i = 0; i < this.state.imageParts.length; i++) {
      formattedText += `:${this.state.emojiName}-${i + 1}:`;
      if ((i + 1) % 7 === 0) {
        formattedText += "\n";
      }
    }
    navigator.clipboard.writeText(formattedText);
  }
}
