import { Formik } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import * as Yup from "yup";
import { Button, OutlinedInput } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  form: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  emailInput: {
    width: "460px",
    height: "40px",
    marginRight: "11px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  emailButton: {
    height: "40px",
    width: "132px",
  },
}));

export default function Subscribe() {
  const classes = useStyles();

  return (
    <div>
      <Formik
        initialValues={{
          email: "",
        }}
        onSubmit={async values => {
          console.log(values);
        }}
        validationSchema={Yup.object({
          email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
        })}
      >
        {props => {
          const { values, touched, errors, handleChange, handleBlur, handleSubmit, isValid } = props;

          return (
            <form onSubmit={handleSubmit} className={classes.form}>
              <div>
                <OutlinedInput
                  disabled={true}
                  className={classes.emailInput}
                  id="email"
                  placeholder="Coming soon"
                  type="text"
                  autoComplete="off"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email && touched.email}
                />
                {errors.email && touched.email && <div className="input-create-nft-feedback">{errors.email}</div>}
              </div>

              <Button className={classes.emailButton} variant="outlined" type="submit" size="small" disabled={true}>
                {" "}
                {/* !isValid */}
                Subscribe
              </Button>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}
