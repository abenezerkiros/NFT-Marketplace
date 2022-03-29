// MUI
import { Box, Backdrop, Button, Fade, Modal, Paper, Typography, IconButton, SvgIcon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

// types
import { ErrorType } from "src/hooks/useError";

// icons
import { ReactComponent as AlarmIcon } from "src/styles/images/alarm.svg";

// context
import { useErrorDispatchContext } from "src/hooks/useError";

const useStyles = makeStyles(() => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:focus": {
      outline: "none",
    },
  },
  paper: {
    width: "480px",
  },
  section: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  message: {
    textAlign: "center",
  },
}));

export interface ErrorProps {
  id?: string;
  title?: string;
  type: ErrorType;
  message: string;
  open: boolean;
}

const ErrorPopup = ({ id = "error1", title = "Error", type = ErrorType.Error, message, open }: ErrorProps) => {
  const classes = useStyles();
  const dispatch = useErrorDispatchContext();
  return (
    <Modal
      id={id}
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-message"
      className={classes.modal}
      open
      onClose={() => {
        // @ts-ignore
        dispatch({ type: "REMOVE_ERROR", id });
      }}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 100,
      }}
    >
      <Fade in mountOnEnter unmountOnExit style={{ outline: "none" }}>
        <Box display="flex" alignItems="flex-start">
          <Paper className={classes.paper}>
            <div className={classes.section}>
              <SvgIcon component={AlarmIcon} viewBox="0 0 57 57" />
              <Typography variant="h2">{title}</Typography>
            </div>
            <hr style={{ width: "100%" }} />

            <Box className={classes.section}>
              <Typography className={classes.message}>{message}</Typography>
            </Box>

            <hr style={{ width: "100%" }} />

            <Box className={classes.section}>
              {/*<Button variant="contained" size="large" onClick={onClose}>*/}
              {/*  Close*/}
              {/*</Button>*/}
              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  // @ts-ignore
                  dispatch({ type: "REMOVE_ERROR", id });
                }}
              >
                Ok
              </Button>
            </Box>
          </Paper>
          <IconButton
            onClick={() =>
              // @ts-ignore
              dispatch({ type: "REMOVE_ERROR", id })
            }
          >
            <CloseIcon fontSize="small" width={24} />
          </IconButton>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ErrorPopup;
