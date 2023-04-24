import { TextField } from "@mui/material";
import React, { useState, useContext } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Link } from "react-router-dom";
//context:
import { ItemsContext } from "../contexts/ItemsContext";
//FORMIK
import { Formik } from "formik";
//YUP => crea un esquema de validacion para los campos
import * as yup from "yup";

//components
import Success from "../pages/Success";
import { Button } from "react-bootstrap";

//esquema de validacion
const yupSchema = yup.object({
    name: yup.string().min(3).max(30).required("Name is required"),
    lastName: yup.string().min(3).max(30).required("Last name is required"),
    phone: yup.string().required("Phone is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    repaetEmail: yup
        .string()
        .oneOf([yup.ref("email"), null], "Emails must match")
        .required("Email confirmation is required"),
});

const FormCart = ({ data }) => {

    //methods tiene state y dispatch
    const { methods } = useContext(ItemsContext);
    //guardar el id de purchase para poder desplegar el mensaje de exito
    const [purchaseID, setPurchaseID] = useState("");
    //keep track of whether the form has been submitted or not
    const [submitted, setSubmitted] = useState(false);

    const submitHandeler = async (values, resetForm) => {
        const docRef = await addDoc(collection(db, "purchases"), {
            ...values,
            items: methods.state,
            total: data.total,
            countItems: data.countItems,
            date: new Date().toLocaleDateString("es-AR"), // Add the date in the desired format
            status: "Generada", // Add the state
        });
        console.log("Document written with id: ", docRef.id);
        setPurchaseID(docRef.id);
        setSubmitted(true);
        methods.submittedDispatch({ type: "SUBMIT", payload: { submitted: submitted, purchaseID:docRef.id} });
        resetForm();
    };
    console.log(methods.submittedState.submitted);
    console.log(methods.submittedState.purchaseID);
    console.log(methods.submittedDispatch)
    return (
            <>{submitted? 
                (
                    <Success purchaseID={purchaseID} /> 
                ) : (
                    <div id="form-detail" className="mt-5 d-flex flex-column">
                        <h3 className="d-flex align-items-center justify-content-center">
                            {" "}
                            Continue Purchase{" "}
                        </h3>
                        <Formik
                            initialValues={{
                                name: "",
                                lastName: "",
                                phone: "",
                                email: "",
                                repaetEmail: "",
                            }}
                            onSubmit={(values, { resetForm }) =>
                                submitHandeler(values, resetForm)
                            }
                            validationSchema={yupSchema}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleSubmit,
                                isValid,
                                dirty,
                                ErrorMessage,
                            }) => (
                                <form
                                    className="formContainer d-flex flex-column"
                                    onSubmit={handleSubmit}
                                >
                                    <div className="d-flex flex-column">
                                        <h4 className="mb-3 mt-3">Personal info</h4>
                                        <TextField
                                            className="mb-3"
                                            placeholder="Name"
                                            name="name"
                                            value={values.name}
                                            onChange={handleChange}
                                        />
                                        {errors.name && (
                                            <span style={{ color: "red" }}>{errors.name}</span>
                                        )}
                                        <TextField
                                            className="mb-3"
                                            placeholder="Last name"
                                            name="lastName"
                                            value={values.lastName}
                                            onChange={handleChange}
                                        />
                                        {errors.lastName && (
                                            <span style={{ color: "red" }}>{errors.lastName}</span>
                                        )}
                                        <TextField
                                            className="mb-3"
                                            placeholder="Celphone"
                                            name="phone"
                                            value={values.phone}
                                            onChange={handleChange}
                                        />
                                        {errors.phone && (
                                            <span style={{ color: "red" }}>{errors.phone}</span>
                                        )}
                                    </div>
                                    <div className="d-flex flex-column">
                                        <h4 className="mb-3 mt-3">Email</h4>
                                        <TextField
                                            className="mb-3"
                                            placeholder="Email"
                                            name="email"
                                            value={values.email}
                                            onChange={handleChange}
                                        />
                                        {errors.email && (
                                            <span style={{ color: "red" }}>{errors.email}</span>
                                        )}
                                        <TextField
                                            className="mb-3"
                                            placeholder="Repeat Email"
                                            name="repaetEmail"
                                            value={values.repaetEmail}
                                            onChange={handleChange}
                                        />
                                        {errors.repaetEmail && (
                                            <span style={{ color: "red" }}>{errors.repaetEmail}</span>
                                        )}
                                    </div>
                                    <Button
                                        className="btnForm d-flex justify-content-center m-3"
                                        type="submit"
                                        disabled={!(isValid && dirty)}
                                    >
                                        Buy
                                    </Button>
                                </form>
                            )}
                        </Formik>        
                    </div>
            )}</>
    );
};

export default FormCart;
