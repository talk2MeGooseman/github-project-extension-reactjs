import React from 'react';
import { withFormik, Field } from 'formik';

const InnerForm = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  }) => (
    <form onSubmit={handleSubmit} className="mui-form">
        <div className={'mui-textfield'}>
            <Field type="text" name="username" placeholder="Github Username" />
        </div>
        {touched.username && errors.username && <div className="mui--bg-danger mui--text-white">{errors.username}</div>}
        <button type="submit" disabled={isSubmitting} className={'mui-btn mui-btn--primary mui-btn--raised'}>
            Submit
        </button>
    </form>
  );


  // Wrap our form with the using withFormik HoC
const MyForm = withFormik({
    // Transform outer props into form values
    mapPropsToValues: props => ({ username: '', repos: [] }),
    // Add a custom validation function (this can be async too!)
    validate: (values, props) => {
        const errors = {};
        if (!values.username) {
            errors.username = 'Required';
        } else if (
            !/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(values.username)
        ) {
            errors.username = 'Invalid username';
        }

        // if (
        //     !/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}\/[A-Z0-9.-]+$/i.test(values.repo)
        // ) {
        //     errors.repo = 'Invalid Repository Name';
        // }
        return errors;
    },
    // Submission handler
    handleSubmit: (values, { props, setSubmitting, setErrors /* setValues, setStatus, and other goodies */,}
    ) => {
        props.onSubmitInfo(values);
        setSubmitting(false);
    //   LoginToMyApp(values).then(
    //     user => {
    //       setSubmitting(false);
    //       // do whatevs...
    //       // props.updateUser(user)
    //     },
    //     errors => {
    //       setSubmitting(false);
    //       // Maybe even transform your API's errors into the same shape as Formik's!
    //       setErrors(transformMyApiErrors(errors));
    //     }
    //   );
    },
  })(InnerForm);

export default MyForm;