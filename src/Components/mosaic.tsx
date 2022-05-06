import React from "react";
import { Button } from "@mui/material";
import saveAs from "file-saver";
import JSZip from "jszip";
import axios from "axios";

interface MosaicProps {}
interface MosaicState {
  images: Array<string>;
}

export default class Mosaic extends React.Component<MosaicProps, MosaicState> {
  constructor(props: MosaicProps) {
    super(props);

    this.state = {
      images: [],
    };

    this.uploadImage = this.uploadImage.bind(this);
    this.downloadImages = this.downloadImages.bind(this);
  }
  render() {
    var maxWidth = 7;
    var currentIndex = 0;

    var renderedImages = [];
    var currentRow = [];
    for (var i = 0; i < this.state.images.length; i++) {
      currentRow.push(
        <img
          src={this.state.images[i]}
          style={{ paddingRight: "2px", paddingBottom: "2px" }}
          alt="alt"
        />
      );

      currentIndex++;

      if (currentIndex === maxWidth) {
        renderedImages.push(
          <div style={{ display: "flex" }}>{currentRow}</div>
        );
        currentRow = [];
        currentIndex = 0;
      }
    }

    return (
      <div>
        <label htmlFor="contained-button-file">
          <input
            hidden
            accept="image/*"
            id="contained-button-file"
            type="file"
            onChange={this.uploadImage}
          />
          <Button variant="contained" component="span">
            Upload
          </Button>
        </label>
        {renderedImages}
        <Button variant="contained" onClick={this.downloadImages}>
          Download
        </Button>
      </div>
    );
  }

  async uploadImage(event: React.FormEvent<HTMLInputElement>) {
    if (!event.currentTarget.files) {
      return;
    }

    var response = await axios.put(
      `https://14b8zg5490.execute-api.us-west-2.amazonaws.com/`,
      event.currentTarget.files[0]
    );

    this.setState({
      images: response.data,
    });
  }

  async downloadImages() {
    const zip = new JSZip();
    const emojiZip = zip.folder("emoji-pack");

    for (var i = 0; i < this.state.images.length; i++) {
      var base64ImageString = this.state.images[i];

      // Trim base64 metadata from string
      // data:image/png;base64,iVBORw0KGgo...
      var index = base64ImageString.indexOf(",");
      if (index !== -1) {
        base64ImageString = base64ImageString.substring(
          index + 1,
          base64ImageString.length
        );
      }

      emojiZip?.file(`emoji-${i + 1}.png`, base64ImageString, { base64: true });
    }

    const archive = await zip.generateAsync({ type: "blob" });
    saveAs(archive, "emoji-pack");
  }
}
