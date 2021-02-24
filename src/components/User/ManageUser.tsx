import React, { useState, useEffect } from "react";
import { match } from "react-router-dom";
import { History } from "history";
import {
  Grid,
  TextField,
  Button,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  FormGroup,
  Checkbox,
} from "@material-ui/core";
import IUser from "../../models/User";
import Response from "../../models/Response";

interface Props {
  match: match<DetailParams>;
  history: History;
}

interface DetailParams {
  userId: string;
}

interface FormElement {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  address: string;
  gender: string;
  image:any;
  hobby: { [key: string] : boolean };
}

interface FormElementError {
  firstNameError: string;
  lastNameError: string;
  emailAddressError: string;
  mobileNumberError: string;
  addressError: string;
}

const emailValidator = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const mobileNumberValidator = /^(\+\d{1,3}[- ]?)?\d{10}$/;

const ManageUser: React.FC<Props> = ({ match, history }) => {
  const [previewImage, setPreviewImage] = useState<string>();
  const [formState, setFormState] = useState<FormElement>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    address: "",
    gender: "male",
    image: null,
    hobby: {
      movie: false,
      listening: false,
      games: false,
    },
  });
  const [formErrorState, setFormErrorState] = useState<FormElementError>({
    firstNameError: "",
    lastNameError: "",
    emailAddressError: "",
    mobileNumberError: "",
    addressError: "",
  });

  const userId = match.params.userId;

  //   useEffect(() => {
  //     if (userId) {
  //       fetch("http://localhost:8080/manage-user/" + userId, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       })
  //         .then((result) => {
  //           return result.json();
  //         })
  //         .then((data: Response<IUser>) => {
  //           const user = data.data[0];
  //           setFormState({
  //             firstName: user.FirstName,
  //             lastName: user.LastName,
  //             email: user.Email,
  //             mobile: user.MobileNumber,
  //             address: user.Address,
  //           });
  //         });
  //     }
  //   });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
    return;
  };

  const checkBoxHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    console.log(checked);
    setFormState({
      ...formState,
      hobby: {
        ...formState.hobby,
        [event.target.name]: checked,
      },
    });
    return;
  };

  const fileHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.files?.[0],
    });
    return;
  };

  const handleBlur = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = event.target;

    validateField(name);
    return;
  };

  const validateField = (name: string) => {
    let isValid = false;

    if (name === "firstName") isValid = validateFirstName();
    else if (name === "lastName") isValid = validateLastName();
    else if (name === "email") isValid = validateEmailAddress();
    else if (name === "mobile") isValid = validateMobileNumber();
    return isValid;
  };

  const validateFirstName = () => {
    let firstNameError = "";
    const value = formState.firstName;
    if (value.trim() === "") {
      firstNameError = "First Name is required";
    }

    setFormErrorState({
      ...formErrorState,
      firstNameError: firstNameError,
    });
    return firstNameError === "";
  };

  const validateLastName = () => {
    let lastNameError = "";
    const value = formState.lastName;
    if (value.trim() === "") {
      lastNameError = "Last Name is required";
    }

    setFormErrorState({
      ...formErrorState,
      lastNameError: lastNameError,
    });
    return lastNameError === "";
  };

  const validateEmailAddress = () => {
    let emailAddressError = "";
    const value = formState.email;
    if (value.trim() === "") {
      emailAddressError = "Email Address is required";
    } else if (!emailValidator.test(value)) {
      emailAddressError = "Email is not valid";
    }

    setFormErrorState({
      ...formErrorState,
      emailAddressError: emailAddressError,
    });
    return emailAddressError === "";
  };

  const validateMobileNumber = () => {
    let mobileNumberError = "";
    const value = formState.mobile;
    if (value.trim() === "") {
      mobileNumberError = "Mobile number is required";
    } else if (!mobileNumberValidator.test(value)) {
      mobileNumberError = "Mobile number is not valid";
    }

    setFormErrorState({
      ...formErrorState,
      mobileNumberError: mobileNumberError,
    });
    return mobileNumberError === "";
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let formFields = ["firstName", "lastName", "email", "mobile"];
    let isValid = true;
    formFields.forEach((field) => {
      isValid = validateField(field) && isValid;
    });
  
    if (isValid) {
      let reader = new FileReader();
      reader.readAsDataURL(formState.image);
      reader.onload = (e) => {
        setPreviewImage(e.target?.result?.toString())
        if (userId) {
          fetch("http://localhost:8080/manage-user/" + userId, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              FirstName: formState.firstName,
              LastName: formState.lastName,
              MobileNumber: formState.mobile,
              Email: formState.email,
              Address: formState.address,
              Gender: formState.gender,
              Hobby: formState.hobby,
              Image: e.target?.result?.toString()
            }),
          })
            .then((result) => {
              return result.json();
            })
            .then((result: Response<IUser>) => {
              if (result.success) {
                history.push({ pathname: "/" });
              }
            });
        } else {
          fetch("http://localhost:8080/manage-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              FirstName: formState.firstName,
              LastName: formState.lastName,
              MobileNumber: formState.mobile,
              Email: formState.email,
              Address: formState.address,
              Gender: formState.gender,
              Hobby: formState.hobby,
              Image: formState.image
            }),
          })
            .then((result) => {
              return result.json();
            })
            .then((result: Response<IUser>) => {
              if (result.success) {
                history.push({ pathname: "/" });
              }
            });
        }
      };
    }
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
    >
      {/* <Paper elevation={20} className={classes.Paper}> */}
      <Grid>
        <h2>Manage User</h2>
      </Grid>
      <Grid lg={4} sm={6} item>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formState.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="off"
            error={formErrorState.firstNameError.length > 0}
            helperText={formErrorState.firstNameError}
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formState.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="off"
            error={formErrorState.lastNameError.length > 0}
            helperText={formErrorState.lastNameError}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="off"
            error={formErrorState.emailAddressError.length > 0}
            helperText={formErrorState.emailAddressError}
          />
          <TextField
            fullWidth
            label="Phone Number"
            type="number"
            name="mobile"
            value={formState.mobile}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="off"
            error={formErrorState.mobileNumberError.length > 0}
            helperText={formErrorState.mobileNumberError}
          />
          <FormControl>
            <FormLabel>Gender</FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender"
              row
              value={formState.gender}
              onChange={handleChange}
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel>Hobbies</FormLabel>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formState.hobby.movie}
                    onChange={checkBoxHandler}
                    name="movie"
                  />
                }
                label="Movie"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formState.hobby.listening}
                    onChange={checkBoxHandler}
                    name="listening"
                  />
                }
                label="Listening"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formState.hobby.games}
                    onChange={checkBoxHandler}
                    name="games"
                  />
                }
                label="Games"
              />
            </FormGroup>
          </FormControl>

          <TextField
            fullWidth
            type="file"
            name="image"
            onChange={fileHandler}
            // value={formState.image}
          />
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formState.address}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="off"
            error={formErrorState.addressError.length > 0}
            helperText={formErrorState.addressError}
          />
          <Box display="flex" justifyContent="center" p={2}>
            <Button type="submit" variant="contained" color="primary">
              {userId ? "Update" : "Save"}
            </Button>
          </Box>
        </form>
        <img src={previewImage}>
        </img>
      </Grid>
      
      {/* </Paper> */}
    </Grid>
  
  );
};

export default ManageUser;
