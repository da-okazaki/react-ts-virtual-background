import { FC, useCallback, useState, useEffect } from "react";
import Webcam from "react-webcam";
import "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import { Box, Button, createStyles, makeStyles } from "@material-ui/core";

type EffectType = "none" | "bokeh" | "image";

const VgCamera: FC = () => {
  const classes = useStyles();
  const [model, setModel]: any = useState();
  const [isVgMode, setIsVgMode]: any = useState(false)
  const [callBackId, setCallBackId]: any = useState()
  const [effectTypeState, setEffectTypeState] = useState<EffectType>("none");

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

  /**
   * compositeFrame
   */
  const compositeFrame = async (video: any, canvas: any, backgroundDarkeningMask: any) => {
    if (!backgroundDarkeningMask) return;
    // grab canvas holding the bg image
    var ctx = canvas.getContext('2d');
    // composite the segmentation mask on top
    ctx.globalCompositeOperation = 'destination-over';
    ctx.putImageData(backgroundDarkeningMask, 0, 0);
    // composite the video frame
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(video, 0, 0, 640, 480);
  }


  /**
   * removeBg
   */
  const removeBg = async () => {
    const video: any = document.getElementById("webcam");
    const canvas: any = document.getElementById("canvas");

    // ? Segmentation occurs here, taking video frames as the input
    const segmentation = await model.segmentPerson(video, {
        flipHorizontal: false,
        internalResolution: 'medium',
        segmentationThreshold: 0.5
    });

    const foregroundColor = { r: 0, g: 0, b: 0, a: 255 };
    const backgroundColor = { r: 0, g: 0, b: 0, a: 0 };
    const backgroundDarkeningMask = bodyPix.toMask(segmentation, foregroundColor, backgroundColor, false);
    compositeFrame(video, canvas, backgroundDarkeningMask);
    setCallBackId(requestAnimationFrame(removeBg))
  }

  const startRenderFrame = () => {
    setIsVgMode(true)
    removeBg()
  };

  const stopRenderFrame = useCallback(() => {
    setIsVgMode(false)
    cancelAnimationFrame(callBackId)
  }, [callBackId]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Box style={{ position: "absolute", top: 100, zIndex: 500 }}>
        <Button onClick={startRenderFrame}>推定</Button>
        <Button onClick={stopRenderFrame}>停止</Button>
      </Box>

      <div className={classes.wrapperStyle}>
        <Webcam
          id="webcam"
          className={classes.cameraStyle}
          width={640}
          height={480}
        />
        <canvas
          id="canvas"
          className={isVgMode ? classes.canvasStyle : classes.disableStyle}
          width={640}
          height={480}
        />
      </div>
    </div>
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
      backgroundImage: "url(../assets/vg_image_001.jpeg)"
    },

    disableStyle: {
      display: "none"
    }
  })
);
