# ✂️ Emoji Mosaic

This repository contains the source code for the website [https://emojimosaic.dev](https://emojimosaic.dev) and was bootstrapped using [`create-react-app`](https://github.com/facebook/create-react-app).

This website allows for taking a source image, slicing it into smaller images that can be uploaded as individual emoji to create mosaics in Slack, Discord, or other messaging platforms.

## Example Usage

### Upload Image

![](./assets/readme/starry-night.jpeg)

### Download Image Parts

#### Bulk Upload Emoji to Slack

Slack currently does not expose a way to bulk upload emoji through their web interface; however, this Google Chrome extension can be used to make this upload process quick and easy!

[Neutral Face Emoji Tools](https://chrome.google.com/webstore/detail/neutral-face-emoji-tools/anchoacphlfbdomdlomnbbfhcmcdmjej)

#### Image Parts

![](./assets/readme/starry-night/starry-night-1.png) ![](./assets/readme/starry-night/starry-night-2.png) ![](./assets/readme/starry-night/starry-night-3.png) ![](./assets/readme/starry-night/starry-night-4.png) ![](./assets/readme/starry-night/starry-night-5.png) ![](./assets/readme/starry-night/starry-night-6.png) ![](./assets/readme/starry-night/starry-night-7.png)

![](./assets/readme/starry-night/starry-night-8.png) ![](./assets/readme/starry-night/starry-night-9.png) ![](./assets/readme/starry-night/starry-night-10.png) ![](./assets/readme/starry-night/starry-night-11.png) ![](./assets/readme/starry-night/starry-night-12.png) ![](./assets/readme/starry-night/starry-night-13.png) ![](./assets/readme/starry-night/starry-night-14.png)

![](./assets/readme/starry-night/starry-night-15.png) ![](./assets/readme/starry-night/starry-night-16.png) ![](./assets/readme/starry-night/starry-night-17.png) ![](./assets/readme/starry-night/starry-night-18.png) ![](./assets/readme/starry-night/starry-night-19.png) ![](./assets/readme/starry-night/starry-night-20.png) ![](./assets/readme/starry-night/starry-night-21.png)

![](./assets/readme/starry-night/starry-night-22.png) ![](./assets/readme/starry-night/starry-night-23.png) ![](./assets/readme/starry-night/starry-night-24.png) ![](./assets/readme/starry-night/starry-night-25.png) ![](./assets/readme/starry-night/starry-night-26.png) ![](./assets/readme/starry-night/starry-night-27.png) ![](./assets/readme/starry-night/starry-night-28.png)

![](./assets/readme/starry-night/starry-night-29.png) ![](./assets/readme/starry-night/starry-night-30.png) ![](./assets/readme/starry-night/starry-night-31.png) ![](./assets/readme/starry-night/starry-night-32.png) ![](./assets/readme/starry-night/starry-night-33.png) ![](./assets/readme/starry-night/starry-night-34.png) ![](./assets/readme/starry-night/starry-night-35.png)

![](./assets/readme/starry-night/starry-night-36.png) ![](./assets/readme/starry-night/starry-night-37.png) ![](./assets/readme/starry-night/starry-night-38.png) ![](./assets/readme/starry-night/starry-night-39.png) ![](./assets/readme/starry-night/starry-night-40.png) ![](./assets/readme/starry-night/starry-night-41.png) ![](./assets/readme/starry-night/starry-night-42.png)

### Create Mosaic

This application gives users a quick-copy button to be able to copy the Slack-friendly formatted text after the emoji have been properly uploaded to the workspace. For example, the mosaic below is generated from the following text block

```
:starry-night-1::starry-night-2::starry-night-3::starry-night-4::starry-night-5::starry-night-6::starry-night-7:
:starry-night-8::starry-night-9::starry-night-10::starry-night-11::starry-night-12::starry-night-13::starry-night-14:
:starry-night-15::starry-night-16::starry-night-17::starry-night-18::starry-night-19::starry-night-20::starry-night-21:
:starry-night-22::starry-night-23::starry-night-24::starry-night-25::starry-night-26::starry-night-27::starry-night-28:
:starry-night-29::starry-night-30::starry-night-31::starry-night-32::starry-night-33::starry-night-34::starry-night-35:
:starry-night-36::starry-night-37::starry-night-38::starry-night-39::starry-night-40::starry-night-41::starry-night-42:
```

![](./assets/readme/slack.png)

## Getting Started

This repository leverages [VSCode's devcontainer](https://code.visualstudio.com/docs/remote/containers) feature to ensure all necessary dependencies are available inside the container for development.

### Application

To get started:

```bash
npm init && npm start
```

This will start the application on your local machine, running on [http://localhost:3000/](http://localhost:3000).

### Deployments

All application deployments are managed via GitHub Actions and the [`./.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) workflow.

Additionally, application dependencies are automatically managed and updated via Dependabot and the [`./.github/workflows/automerge-dependabot.yml`](./.github/workflows/automerge-dependabot.yml) workflow.
