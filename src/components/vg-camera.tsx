import { FC, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

import { useSelector } from 'react-redux';
import { RootState } from '../app/rootReducer';

const VgCamera: FC = () => {
  const classes = useStyles();
  const { virtualBgType, virtualBgImage } = useSelector((state: RootState) => state.medias);
  const [model, setModel]: any = useState();
  const [callBackId, setCallBackId]: any = useState();

  useEffect(() => {
    const params: any = {
      architecture: 'MobileNetV1',
      outputStride: 16,
      multiplier: 0.75,
      quantBytes: 2,
    };

    bodyPix.load(params).then((net: any) => {
      setModel(net);
    });
  }, []);

  useEffect(() => {
    if (virtualBgType === 'image') {
      /**
       * compositeFrame
       */
      const compositeFrame = async (video: HTMLVideoElement, canvas: HTMLCanvasElement, mask: any, seg: any) => {
        if (!mask) return;
        const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(video, 0, 0);
        const fgImg = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // background
        const bgcanvas = document.createElement("canvas");
        bgcanvas.width = video.width;
        bgcanvas.height = canvas.height;
        const ctxBg = bgcanvas.getContext("2d");
        if (!ctxBg) return;

        const img = require(`../${virtualBgImage}`);

        ctxBg.drawImage(
          // img,
          canvas,
          0,
          0,
          img.width,
          img.height,
          0,
          0,
          canvas.width,
          canvas.height
        );
        const bgImg = ctxBg.getImageData(0, 0, canvas.width, canvas.height);

        // 描画
        const ctxImg = canvas.getContext("2d");
        if (!ctxImg) return;
        const ctxImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const bytes = ctxImageData.data;
        for (let i = 0; i < canvas.height; i++) {
          for (let j = 0; j < canvas.width; j++) {
            const n = i * canvas.width + j;
            if (seg.data[n] === 1) {
              // for foreground (人)
              bytes[4 * n + 0] = fgImg.data[4 * n + 0];
              bytes[4 * n + 1] = fgImg.data[4 * n + 1];
              bytes[4 * n + 2] = fgImg.data[4 * n + 2];
              bytes[4 * n + 3] = fgImg.data[4 * n + 3];
            } else {
              // for background (背景)
              bytes[4 * n + 0] = bgImg.data[4 * n + 0];
              bytes[4 * n + 1] = bgImg.data[4 * n + 1];
              bytes[4 * n + 2] = bgImg.data[4 * n + 2];
              bytes[4 * n + 3] = bgImg.data[4 * n + 3];
            }
          }
        }
        ctxImg.putImageData(ctxImageData, 0, 0);
      };


      /**
       * removeBg
       */
      const removeBg = async () => {
        const video: any = document.getElementById('webcam');
        const canvas: any = document.getElementById('canvas');

        // ? Segmentation occurs here, taking video frames as the input
        if (!model) return;
        const segmentation = await model.segmentPerson(video, {
          flipHorizontal: false,
          internalResolution: 'medium',
          segmentationThreshold: 0.5,
        });

        const foregroundColor = { r: 0, g: 0, b: 0, a: 255 };
        const backgroundColor = { r: 0, g: 0, b: 0, a: 0 };
        const backgroundDarkeningMask = bodyPix.toMask(segmentation, foregroundColor, backgroundColor, false);
        compositeFrame(video, canvas, backgroundDarkeningMask, segmentation);
        setCallBackId(requestAnimationFrame(removeBg));
      };
      removeBg();
    } else if (virtualBgType === 'bokeh') {
      const removeBg = async () => {
        const video: any = document.getElementById('webcam');
        const canvas: any = document.getElementById('canvas');

        // ? Segmentation occurs here, taking video frames as the input
        if (!model) return;
        const segmentation = await model.segmentPerson(video, {
          flipHorizontal: false,
          internalResolution: 'medium',
          segmentationThreshold: 0.5,
        });

        const backgroundBlurAmount = 30;
        const edgeBlurAmount = 10;
        const flipHorizontal = false;
        bodyPix.drawBokehEffect(
          canvas,
          video,
          segmentation,
          backgroundBlurAmount,
          edgeBlurAmount,
          flipHorizontal
        );

        setCallBackId(requestAnimationFrame(removeBg));
      };
      removeBg();
    } else {
      cancelAnimationFrame(callBackId);
    }
  }, [virtualBgType]);

  return (
    <div className={classes.wrapperStyle}>
      <Webcam id='webcam' className={classes.cameraStyle} width={640} height={480} />
      <canvas
        id='canvas'
        className={virtualBgType === 'none' ? classes.disableStyle : classes.canvasStyle}
        style={virtualBgType === 'image' ? { backgroundImage: `url(${virtualBgImage})` } : {}}
        width={640}
        height={480}
      />
    </div>
  );
};
export default VgCamera;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapperStyle: {
      height: '70%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      boxSizing: 'border-box',
      backgroundColor: '#e1e5ea',
      borderRadius: '5px',
      position: 'relative',
    },

    cameraStyle: {
      width: '70%',
      height: '70%',
      position: 'absolute',
      zIndex: 10,
      transform: 'scaleX(-1)',
    },

    canvasStyle: {
      width: '70%',
      height: '70%',
      position: 'absolute',
      zIndex: 20,
      transform: 'scaleX(-1)',
      objectFit: 'contain',
      backgroundSize: 'cover',
    },

    disableStyle: {
      display: 'none',
    },
  })
);
