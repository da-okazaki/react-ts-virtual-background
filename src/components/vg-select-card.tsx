import * as React from 'react';
import { Card, CardMedia, createStyles, makeStyles } from '@material-ui/core';

import { dataList } from '../constants/card-data';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/rootReducer';
import {
  onClickSelectedId,
  onClickToggleModeClear,
  onClickToggleVirtualBokehMode,
  onClickToggleVirtualImageMode,
} from '../features/medias/mediasSlice';

const VgSelectCard: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { selectedId } = useSelector((state: RootState) => state.medias);

  const onClickEvents = (idx: number, id: string, image: string) => {
    dispatch(onClickSelectedId(id));
    if (idx === 0) {
      dispatch(onClickToggleModeClear());
    } else if (idx === 1) {
      dispatch(onClickToggleVirtualBokehMode());
    } else {
      dispatch(onClickToggleVirtualImageMode(image));
    }
  };

  return (
    <div className={classes.root}>
      {dataList.map((data, idx) => {
        return (
          <Card
            className={selectedId === data.id ? classes.selectCardStyle : classes.cardStyle}
            key={data.id}
            onClick={() => onClickEvents(idx, data.id, data.image)}
          >
            <CardMedia className={classes.cardMediaStyle} title={data.label} image={data.image} />
          </Card>
        );
      })}
    </div>
  );
};
export default VgSelectCard;

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: '700px',
      height: '100px',
      backgroundColor: '#e1e5ea',
      marginBottom: '8px',
      borderRadius: '5px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
    },

    cardStyle: {
      height: '80px',
      width: '60px',
      margin: '0 5px',
    },

    selectCardStyle: {
      height: '85px',
      width: '65px',
      margin: '0 5x',
      borderColor: 'blue',
      borderWidth: '2px',
      borderStyle: 'solid',
    },

    cardMediaStyle: {
      width: '100%',
      height: '100%',
    },
  })
);
