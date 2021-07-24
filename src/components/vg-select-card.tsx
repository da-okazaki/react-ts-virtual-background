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
    <div className={classes.wrapperStyle}>
      {dataList.map((data, idx) => {
        return (
          <Card
            className={selectedId === data.id ? classes.cardStyle + ' ' + classes.selectCardStyle : classes.cardStyle}
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
    wrapperStyle: {
      width: '100%',
      height: '100px',
      backgroundColor: '#e1e5ea',
      margin: '30px 0 8px 0',
      borderRadius: '5px',
      display: 'flex',
      alignItems: 'center',
    },

    cardStyle: {
      height: '80px',
      width: '60px',
      margin: '0 10px',
    },

    selectCardStyle: {
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
