import React from 'react';
import { withFormik, Field } from 'formik';
const regex = /^selected-(\d+)/;

function _repoTableRows(repos) {
    return repos.map((repo) => {
        return(
            <tr>
                <td><a href={repo.html_url} target='_blank'>{repo.full_name}</a></td>
                <td>
                    <div class="mui-checkbox">
                        <label>
                            <Field type="checkbox" name={`selected-${repo.id}`} placeholder="Display in Panel" value={repo.id} />
                        </label>
                    </div>
                </td>
            </tr>
        )
    });
}

function _repoTableForm(repos) {
    return (
        <table class="mui-table mui-table--bordered">
            <thead>
                <tr>
                    <th>Repository</th>
                    <th>Show in Panel</th>
                </tr>
            </thead>
            <tbody>
                {_repoTableRows(repos)}
            </tbody>
        </table>
    );
};

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
        <div>Edit</div>
        <div className={'mui-textfield'}>
            <Field type="text" name="username" placeholder="Github Username" value={values.username}/>
        </div>
        {touched.username && errors.username && <div className="mui--bg-danger mui--text-white">{errors.username}</div>}
        <div className={'mui-textfield'}>
            <Field type="url" name="avater_url" placeholder="Avatar URL" value={values.avatar_url}/>
        </div>
        {touched.avatar_url && errors.avatar_url && <div className="mui--bg-danger mui--text-white">{errors.avatar_url}</div>}
        <h3>Select Your Repositories</h3>
        {_repoTableForm(values.repos)}
        <div className="mui--bg-danger mui--text-white">{errors.select}</div>
        <button type="submit" disabled={isSubmitting} className={'mui-btn mui-btn--primary mui-btn--raised'}>
            Submit
        </button>
    </form>
  );


// Wrap our form with the using withFormik HoC
const MyForm = withFormik({
    // Transform outer props into form values
    mapPropsToValues: props => ({ username: props.user.github_user.login, avatar_url: props.user.github_user.avatar_url, repos: props.repos }),
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

        return errors;
    },
    // Submission handler
    handleSubmit: (values, { props, setSubmitting, setErrors /* setValues, setStatus, and other goodies */,}
    ) => {
        let formData = {
            selected_repos: [],
            avatar_url: values.avatar_url,
        };

        for (const key in values) {
            var match = regex.exec(key);
            if (values.hasOwnProperty(key) && values[key] && match !== null) {
                let repo_id = match[1];
                formData.selected_repos.push(repo_id);
            }
        }

        if (formData.selected_repos.length > 0) {
            props.onSubmit(formData);
        } else {
            setErrors({ select: 'Must select at least on Github Project'});           
        }
        setSubmitting(false);
    }
  })(InnerForm);

export default MyForm;