import React from "react"
import styled, { css } from "styled-components"

const colors = {
  canvas: "#ededed",
  pandaBackdrop: "#ededed",
  pandaBody: "#ffffff",
  pandaLeftEar: "#800080",
  pandaFace: "#ff9955",
  pandaRightEar: "#ffdd55",
  pandaLeftArm: "#ccff00",
  pandaRightArm: "#a02c2c",
  pandaLeftFoot: "#8bcfdf",
  pandaRightFoot: "#88aa00;"
}

const transitions = css`
  transition-property: top, left;
  transition-duration: 100ms;
  transition-timing-function: ease-in;
`

const PandaStyled = styled.div`
  display: inline-block;
  position: relative;
  width: 100%;
  background: ${colors.pandaBackdrop};
  z-index: 1000;

  /* This is a trick to keep the panda square (1:1 aspect) */
  padding-bottom: 100%;
`

const PandaPositionedPartStyled = styled.div`
  position: absolute;
`

/* Panda Default Style */

const PandaHeadStyled = styled(PandaPositionedPartStyled)`
  top: 0%;
  left: 14%;
  width: 55.8%;
  height: 41.4%;
  z-index: 2000;
`

const PandaHeadBodyStyled = styled(PandaPositionedPartStyled)`
  top: 7%;
  left: 15%;
  width: 85.5%;
  height: 93%;
  background-color: ${colors.pandaBody};
  border-top-left-radius: 45% 63%;
  border-top-right-radius: 59% 65%;
  border-bottom-right-radius: 15% 37%;
  border-bottom-left-radius: 29% 23%;
  ${transitions}
  &:hover {
    top: -7%;
  }
  z-index: 2200;
`

const PandaHeadFaceStyled = styled(PandaPositionedPartStyled)`
  top: 38%;
  left: 32.5%;
  width: 61%;
  height: 53%;
  ${transitions}
  &:hover {
    top: 26%;
  }
  z-index: 2300;
`

const PandaHeadFaceLeftEyeStyled = styled(PandaPositionedPartStyled)`
  top: 10%;
  left: 0%;
  width: 42.5%;
  height: 64.5%;
  background-color: ${colors.pandaFace};
  border-top-left-radius: 51% 57%;
  border-top-right-radius: 58% 49%;
  border-bottom-right-radius: 78% 47%;
  border-bottom-left-radius: 45% 41%;
  z-index: 2320;
`

const PandaHeadFaceRightEyeStyled = styled(PandaPositionedPartStyled)`
  top: 0%;
  left: 72%;
  width: 27%;
  height: 52%;
  background-color: ${colors.pandaFace};
  border-top-left-radius: 39% 52%;
  border-top-right-radius: 44% 44%;
  border-bottom-right-radius: 30% 47%;
  border-bottom-left-radius: 61% 45%;
  z-index: 2330;
`

const PandaHeadFaceNoseStyled = styled(PandaPositionedPartStyled)`
  top: 55%;
  left: 49%;
  width: 43.4%;
  height: 43%;
  transform: rotate(-10deg);
  z-index: 2310;
`
const PandaHeadFaceNoseMaskStyled = styled(PandaPositionedPartStyled)`
  top: 7%;
  left: 0%;
  width: 99%;
  height: 80%;
  background-color: ${colors.pandaBody};
  border-bottom-right-radius: 58% 97%;
  border-bottom-left-radius: 33% 60%;
  z-index: 2312;
`
const PandaHeadFaceNoseColourStyled = styled(PandaPositionedPartStyled)`
  top: 19%;
  left: 5%;
  width: 92%;
  height: 80%;
  background-color: ${colors.pandaFace};
  border-bottom-right-radius: 48% 89%;
  border-bottom-left-radius: 30% 59%;
  transform: rotate(-10deg);
  z-index: 2311;
`

const PandaHeadLeftEarStyled = styled(PandaPositionedPartStyled)`
  top: 18%;
  left: 0%;
  width: 35.8%;
  height: 67%;
  ${transitions}
  &:hover {
    top: 8%;
    left: -8%;
  }
  z-index: 2400;
`
const PandaHeadLeftEarEarStyled = styled.div`
  width: 85%;
  height: 100%;
  background-color: ${colors.pandaLeftEar};
  border-top-left-radius: 71% 61%;
  border-top-right-radius: 30% 21%;
  border-bottom-right-radius: 50% 79%;
  border-bottom-left-radius: 50% 38%;
  z-index: 2410;
`
const PandaHeadLeftEarMaskStyled = styled(PandaPositionedPartStyled)`
  top: 5%;
  left: 61%;
  width: 26%;
  height: 96.5%;
  background-color: ${colors.pandaBody};
  border-top-left-radius: 58% 40%;
  border-bottom-left-radius: 62% 44%;
  transform: rotate(13deg);
  z-index: 2420;
`

const PandaHeadRightEarStyled = styled(PandaPositionedPartStyled)`
  top: 0%;
  left: 64%;
  width: 24.5%;
  height: 60.5%;
  background-color: ${colors.pandaRightEar};
  border-top-left-radius: 25% 25%;
  border-top-right-radius: 59% 39%;
  border-bottom-right-radius: 68% 57%;
  border-bottom-left-radius: 25%;
  transform-origin: 42% 28%;
  transform: rotate(-50deg);
  ${transitions}
  &:hover {
    top: -10%;
    left: 80%;
  }
  z-index: 2100;
`

const PandaTorsoStyled = styled(PandaPositionedPartStyled)`
  top: 35%;
  left: 3%;
  width: 92.9%;
  height: 64.2%;
  z-index: 1000;
`

const PandaTorsoBodyStyled = styled(PandaPositionedPartStyled)`
  top: 5%;
  left: 25%;
  width: 50.8%;
  height: 75.5%;
  background-color: ${colors.pandaBody};
  border-top-left-radius: 24%;
  border-top-right-radius: 24%;
  border-bottom-right-radius: 45% 60%;
  border-bottom-left-radius: 53% 76%;
  ${transitions}
  &:hover {
    top: 10%;
  }
  z-index: 1300;
`

const PandaTorsoLeftArmStyled = styled(PandaPositionedPartStyled)`
  top: 5%;
  left: 13%;
  width: 31%;
  height: 46.3%;
  ${transitions}
  &:hover {
    left: 0%;
  }
  z-index: 1400;
`
const PandaTorsoLeftArmTopStyled = styled(PandaPositionedPartStyled)`
  top: 0%;
  left: 0%;
  width: 76%;
  height: 67.5%;
  background-color: ${colors.pandaLeftArm};
  border-top-left-radius: 100% 100%;
  border-bottom-right-radius: 100%;
  z-index: 1410;
`
const PandaTorsoLeftArmBottomStyled = styled(PandaPositionedPartStyled)`
  top: 35%;
  left: 0%;
  width: 97%;
  height: 65.5%;
  background-color: ${colors.pandaLeftArm};
  border-top-left-radius: 23% 48%;
  border-top-right-radius: 72% 52%;
  border-bottom-right-radius: 56% 47%;
  border-bottom-left-radius: 33% 50%;
  z-index: 1420;
`
const PandaTorsoLeftArmMaskStyled = styled(PandaPositionedPartStyled)`
  top: 3%;
  left: 54.5%;
  width: 70%;
  height: 49%;
  background-color: ${colors.pandaBody};
  border-top-left-radius: 29% 50%;
  border-bottom-left-radius: 95% 50%;
  z-index: 1430;
`

const PandaTorsoRightArmStyled = styled(PandaPositionedPartStyled)`
  top: 0%;
  left: 51%;
  width: 28.7%;
  height: 47.2%;
  ${transitions}
  &:hover {
    left: 55%;
  }
  z-index: 1500;
`
const PandaTorsoRightArmTopStyled = styled(PandaPositionedPartStyled)`
  top: 0%;
  left: 37.5%;
  width: 88.5%;
  height: 66.5%;
  background-color: ${colors.pandaRightArm};
  border-top-left-radius: 20%;
  border-top-right-radius: 80%;
  border-bottom-right-radius: 20%;
  border-bottom-left-radius: 80%;
  transform-origin: 0 0;
  transform: skew(0deg, 23deg) rotate(-16deg);
  z-index: 1510;
`
const PandaTorsoRightArmBottomStyled = styled(PandaPositionedPartStyled)`
  top: 35%;
  left: 52.5%;
  width: 87.5%;
  height: 67.5%;
  background-color: ${colors.pandaRightArm};
  border-top-left-radius: 25%;
  border-top-right-radius: 74% 58%;
  border-bottom-right-radius: 60% 42%;
  border-bottom-left-radius: 40% 42%;
  z-index: 1520;
`
const PandaTorsoRightArmMasktopStyled = styled(PandaPositionedPartStyled)`
  top: 13%;
  left: 25.5%;
  width: 38%;
  height: 33.5%;
  background-color: ${colors.pandaBody};
  transform: rotate(-29deg);
  border-radius: 10%;
  z-index: 1530;
`

const PandaTorsoRightArmMaskbottomStyled = styled(PandaPositionedPartStyled)`
  top: 48%;
  left: 28.5%;
  width: 50.5%;
  height: 11.5%;
  background-color: ${colors.pandaBody};
  transform: rotate(-68deg);
  border-radius: 10%;
  z-index: 1540;
`

const PandaTorsoLeftFootStyled = styled(PandaPositionedPartStyled)`
  top: 50%;
  left: 1%;
  width: 44.8%;
  height: 51%;
  ${transitions}
  &:hover {
    top: 54%;
    left: -5%;
  }
  z-index: 1100;
`
const PandaTorsoLeftFootLeftStyled = styled(PandaPositionedPartStyled)`
  top: 9%;
  left: 11.5%;
  width: 49.5%;
  height: 105.5%;
  background-color: ${colors.pandaLeftFoot};
  transform: rotate(-54deg);
  border-top-left-radius: 54% 38%;
  border-top-right-radius: 56% 44%;
  border-bottom-right-radius: 20%;
  border-bottom-left-radius: 61% 62%;
  z-index: 1110;
`
const PandaTorsoLeftFootMiddleStyled = styled(PandaPositionedPartStyled)`
  top: 0%;
  left: 35%;
  width: 56.5%;
  height: 86%;
  background-color: ${colors.pandaLeftFoot};
  transform: rotate(-40deg);
  border-top-left-radius: 10%;
  border-top-right-radius: 10%;
  border-bottom-right-radius: 88% 54%;
  border-bottom-left-radius: 10%;
  z-index: 1120;
`
const PandaTorsoLeftFootRightStyled = styled(PandaPositionedPartStyled)`
  top: 48%;
  left: 81.5%;
  width: 16.2%;
  height: 20.5%;
  background-color: ${colors.pandaLeftFoot};
  border-radius: 50%;
  z-index: 1130;
`
const PandaTorsoLeftFootMasktopStyled = styled(PandaPositionedPartStyled)`
  top: -13%;
  left: 43.5%;
  width: 11%;
  height: 35.5%;
  background-color: ${colors.pandaBackdrop};
  transform: skew(-50deg, 25deg);
  border-bottom-right-radius: 32%;
  z-index: 1140;
`
const PandaTorsoLeftFootMaskbottomStyled = styled(PandaPositionedPartStyled)`
  top: 56%;
  left: 84%;
  width: 20%;
  height: 29%;
  background-color: ${colors.pandaBackdrop};
  border-top-left-radius: 48% 47%;
  border-top-right-radius: 20%;
  border-bottom-right-radius: 20%;
  border-bottom-left-radius: 20%;
  transform: rotate(23deg);
  z-index: 1150;
`

const PandaTorsoRightFootStyled = styled(PandaPositionedPartStyled)`
  top: 40%;
  left: 61%;
  width: 40.7%;
  height: 44%;
  ${transitions}
  &:hover {
    top: 44%;
    left: 66%;
  }
  z-index: 1200;
`
const PandaTorsoRightFootLeftStyled = styled(PandaPositionedPartStyled)`
  top: 13%;
  left: 0%;
  width: 62%;
  height: 78.5%;
  background-color: ${colors.pandaRightFoot};
  border-top-left-radius: 61%;
  border-bottom-right-radius: 28%;
  border-bottom-left-radius: 40% 17%;
  transform: rotate(10deg);
  z-index: 1210;
`
const PandaTorsoRightFootRightStyled = styled(PandaPositionedPartStyled)`
  top: 0%;
  left: 47%;
  width: 47.5%;
  height: 105%;
  background-color: ${colors.pandaRightFoot};
  border-top-left-radius: 62% 69%;
  border-top-right-radius: 39% 46%;
  border-bottom-right-radius: 42% 48%;
  transform: rotate(20deg);
  z-index: 1220;
`
const PandaTorsoRightFootMaskStyled = styled(PandaPositionedPartStyled)`
  top: 0%;
  left: 53%;
  width: 16%;
  height: 20%;
  background-color: ${colors.pandaBackdrop};
  transform: skew(-50deg, 25deg);
  border-bottom-right-radius: 28%;
  z-index: 1230;
`

const Panda = props => (
  <PandaStyled>
    <PandaHeadStyled>
      <PandaHeadBodyStyled />

      <PandaHeadFaceStyled>
        <PandaHeadFaceLeftEyeStyled />
        <PandaHeadFaceRightEyeStyled />

        <PandaHeadFaceNoseStyled>
          <PandaHeadFaceNoseColourStyled />
          <PandaHeadFaceNoseMaskStyled />
        </PandaHeadFaceNoseStyled>
      </PandaHeadFaceStyled>

      <PandaHeadLeftEarStyled>
        <PandaHeadLeftEarEarStyled />
        <PandaHeadLeftEarMaskStyled />
      </PandaHeadLeftEarStyled>

      <PandaHeadRightEarStyled />
    </PandaHeadStyled>

    <PandaTorsoStyled>
      <PandaTorsoBodyStyled />

      <PandaTorsoLeftArmStyled>
        <PandaTorsoLeftArmTopStyled />
        <PandaTorsoLeftArmBottomStyled />
        <PandaTorsoLeftArmMaskStyled />
      </PandaTorsoLeftArmStyled>

      <PandaTorsoRightArmStyled>
        <PandaTorsoRightArmTopStyled />
        <PandaTorsoRightArmBottomStyled />
        <PandaTorsoRightArmMasktopStyled />
        <PandaTorsoRightArmMaskbottomStyled />
      </PandaTorsoRightArmStyled>

      <PandaTorsoLeftFootStyled>
        <PandaTorsoLeftFootLeftStyled />
        <PandaTorsoLeftFootMiddleStyled />
        <PandaTorsoLeftFootRightStyled />
        <PandaTorsoLeftFootMasktopStyled />
        <PandaTorsoLeftFootMaskbottomStyled />
      </PandaTorsoLeftFootStyled>

      <PandaTorsoRightFootStyled>
        <PandaTorsoRightFootLeftStyled />
        <PandaTorsoRightFootRightStyled />
        <PandaTorsoRightFootMaskStyled />
      </PandaTorsoRightFootStyled>
    </PandaTorsoStyled>
  </PandaStyled>
)

export default Panda

/* Debug */

// .debug { width: 60em; height: 60em; }
// .debug .panda, .debug .panda-reference {
//   position: absolute;
//   top: 0;
//   left: 0;
// }
// .debug .panda { background: none; }
// .debug .panda-reference { display: block !important; z-index: 99; }
// .debug .piece { opacity: 0.7; }
// .debug .piece .colour,
// .debug .panda .head .body,
// .debug .panda .torso .left-arm .top,
// .debug .panda .torso .left-arm .bottom,
// .debug .panda .torso .left-arm .mask,
// .debug .panda .torso .right-arm .top,
// .debug .panda .torso .right-arm .bottom,
// .debug .panda .torso .right-arm .masktop,
// .debug .panda .torso .right-arm .maskbottom,
// .debug .panda .torso .left-foot .left,
// .debug .panda .torso .left-foot .middle,
// .debug .panda .torso .left-foot .right,
// .debug .panda .torso .left-foot .masktop,
// .debug .panda .torso .left-foot .maskbottom,
// .debug .panda .torso .right-foot .left,
// .debug .panda .torso .right-foot .right,
// .debug .panda .torso .right-foot .mask  { background: green !important; }
// .debug .panda .head,
// .debug .panda .head .face,
// .debug .panda .head .left-ear,
// .debug .panda .torso,
// .debug .panda .torso .left-arm,
// .debug .panda .torso .right-arm,
// .debug .panda .torso .left-foot,
// .debug .panda .torso .right-foot { border: 0.1em solid red; }
