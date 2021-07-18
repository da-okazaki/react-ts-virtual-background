import { FC, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';
import { createStyles, makeStyles } from '@material-ui/core';

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
      };

      /**
       * removeBg
       */
      const removeBg = async () => {
        const video: any = document.getElementById('webcam');
        const canvas: any = document.getElementById('canvas');

        // ? Segmentation occurs here, taking video frames as the input
        const segmentation = await model.segmentPerson(video, {
          flipHorizontal: false,
          internalResolution: 'medium',
          segmentationThreshold: 0.5,
        });

        const foregroundColor = { r: 0, g: 0, b: 0, a: 255 };
        const backgroundColor = { r: 0, g: 0, b: 0, a: 0 };
        const backgroundDarkeningMask = bodyPix.toMask(segmentation, foregroundColor, backgroundColor, false);
        compositeFrame(video, canvas, backgroundDarkeningMask);
        setCallBackId(requestAnimationFrame(removeBg));
      };
      removeBg();
    } else if (virtualBgType === 'bokeh') {
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

const useStyles = makeStyles(() =>
  createStyles({
    wrapperStyle: {
      width: 'calc(100% - 16px)',
      maxWidth: '700px',
      height: 'calc(100% - 142px)',
      top: '136px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#e1e5ea',
      borderRadius: '5px',
      flexDirection: 'column',
      position: 'absolute',
    },

    cameraStyle: {
      width: '100%',
      height: 'auto',
      position: 'absolute',
      zIndex: 10,
      transform: 'scaleX(-1)',
    },

    canvasStyle: {
      width: '100%',
      height: 'auto',
      position: 'absolute',
      zIndex: 20,
      transform: 'scaleX(-1)',
    },

    disableStyle: {
      display: 'none',
    },
  })
);
