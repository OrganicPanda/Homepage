import React from "react"
import { Normalize } from "styled-normalize"
import { createGlobalStyle, ThemeProvider } from "styled-components"

const pandaPalette = {
  background: "#ededed",
  body: "#ffffff",
  leftEar: "#800080",
  face: "#ff9955",
  rightEar: "#ffdd55",
  leftArm: "#ccff00",
  rightArm: "#a02c2c",
  leftFoot: "#8bcfdf",
  rightFoot: "#88aa00;"
}
const colors = {
  // https://www.happyhues.co/palettes/14
  standard: {
    background: "#fffffe",
    headline: "#272343",
    paragraph: "#2d334a",
    link: "#272343",
    button: {
      background: "#ffd803",
      text: "#272343"
    },
    illustration: {
      stroke: "#272343",
      main: "#fffffe",
      highlight: "#ffd803",
      secondary: "#e3f6f5",
      tertiary: "#bae8e8"
    },
    card: {
      background: "#fffffe",
      headline: "#272343",
      paragraph: "#2d334a"
    },
    section1: {
      background: "#e3f6f5",
      headline: "#272343",
      subHeadline: "#2d334a"
    },
    panda: pandaPalette
  }
}
const theme = {
  palette: colors.standard,
  screens: {
    large: 768
  }
}

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  }

  body {
    background: ${({ theme }) => theme.palette.background};
  }
`

const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Normalize />
      {children}
    </ThemeProvider>
  )
}

export default Layout
