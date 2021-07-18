import * as React from "react";
import {
  Card,
  CardMedia,
  createStyles,
  makeStyles
} from "@material-ui/core";

import { dataList } from "../constants/card-data"

const VgSelectCard: React.FC = () => {
  const classes = useStyles();
  const [vgMode, setVgMode] = React.useState(false);
  const [isSelected, setIsSelected] = React.useState(false);
  const [selected, setSelected] = React.useState("");

  const onClickToggleVirtualBgMode = (id: string) => {
    setSelected(String(id));
  };

  return (
    <div className={classes.root}>
      {dataList.map((data) => {
        const image = `process.env.PUBLIC_URL/${data.image}`
        //const image = `process.env.PUBLIC_URL/logo192.png`
        return (
          <Card
            className={
              selected === data.id ? classes.selectCardStyle : classes.cardStyle
            }
            key={data.id}
            onClick={() => {
              onClickToggleVirtualBgMode(data.id);
            }}
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
      width: "100%",
      maxWidth: "700px",
      height: "100px",
      backgroundColor: "#e1e5ea",
      marginBottom: "8px",
      borderRadius: "5px",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center"
    },

    cardStyle: {
      height: "80px",
      width: "60px",
      margin: "0 5px"
    },

    selectCardStyle: {
      height: "85px",
      width: "65px",
      margin: "0 5x",
      borderColor: "blue",
      borderWidth: "2px",
      borderStyle: "solid"
    },

    cardMediaStyle: {
      width: "100%",
      height: "100%",
    }
  })
);
