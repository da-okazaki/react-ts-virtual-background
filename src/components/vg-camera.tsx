import { FC, useCallback, useState, useEffect } from "react";
import Webcam from "react-webcam";
import "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import { Box, Button, createStyles, makeStyles } from "@material-ui/core";

type EffectType = "none" | "bokeh" | "image";

const VgCamera: FC = () => {
  const classes = useStyles();
  const [model, setModel]: any = useState();
  const [mask, setMask]: any = useState();
  const [isVgMode, setIsVgMode]: any = useState(true)
  const [callBackId, setCallBackId]: any = useState()

  useEffect(() => {
    const params: any = {
      architecture: "MobileNetV1",
      outputStride: 16,
      multiplier: 0.75,
      quantBytes: 2,
    };

    bodyPix.load(params).then((net: any) => {
      setModel(net);
    });
  }, []);

  useEffect(() => {
    const webcam: any = document.getElementById("webcam");
    const canvas: any = document.getElementById("canvas");
    const opacity = 0.7;

    bodyPix.drawMask(canvas, webcam, mask, opacity, 0, false);
  }, [mask]);

  const startRenderFrame = () => {
    setIsVgMode(true)
    const drawMask = async () => {
      const webcam: any = document.getElementById("webcam");
      const canvas: any = document.getElementById("canvas");
      const foregroundColor = { r: 0, g: 0, b: 0, a: 0 };
      const backgroundColor = { r: 127, g: 127, b: 127, a: 255 };

      const seg = await model.segmentPerson(webcam)

      const mask = bodyPix.toMask(seg, foregroundColor, backgroundColor, true)
      const opacity = 0.7;

      bodyPix.drawMask(canvas, webcam, mask, opacity, 0, false);
      setCallBackId(requestAnimationFrame(drawMask))
    }
    drawMask()
  };

  const stopRenderFrame = useCallback(() => {
    cancelAnimationFrame(callBackId)
  }, [callBackId]);

  return (
    <>
      <Box>
        <Button onClick={startRenderFrame}>推定</Button>
        <Button onClick={stopRenderFrame}>停止</Button>
      </Box>
      <Box>
        <Webcam id="webcam" style={{ transform: "scaleX(-1)"}} width={640} height={480} />
        <canvas id="canvas" style={{ transform: "scaleX(-1)"}} width={640} height={480} />
      </Box>
    </>
  );
};
export default VgCamera;

const useStyles = makeStyles(() =>
  createStyles({
    wrapperStyle: {
      width: "calc(100% - 16px)",
      maxWidth: "700px",
      height: "calc(100% - 124px)",
      top: "120px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#e1e5ea",
      borderRadius: "5px",
      flexDirection: "column",
      position: "absolute"
    },

    cameraStyle: {
      width: "100%",
      height: "35%",
      objectFit: "fill",
      position: "absolute",
      zIndex: 10,
      transform: "scaleX(-1)",
    },

    canvasStyle: {
      width: "100%",
      height: "35%",
      objectFit: "fill",
      position: "absolute",
      zIndex: 20,
      transform: "scaleX(-1)",
    },

    disableStyle: {
      display: "none"
    }
  })
);
