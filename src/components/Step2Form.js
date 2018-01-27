import React from 'react';
import { withFormik, Field } from 'formik';
import GithubImageHeader from "./GithubImageHeader";
const regex = /^selected-(\d+)/;



function _repoTableRows({repos, selected_repos}) {
    return repos.map((repo) => {
        let isChecked = selected_repos ? selected_repos.includes(repo.id) : false;

        return(
            <tr>
                <td><a href={repo.html_url} target='_blank'>{repo.full_name}</a></td>
                <td>
                    <div class="mui-checkbox">
                        <label>
                            <Field type="checkbox" name={`selected-${repo.id}`} placeholder="Display in Panel" defaultChecked={isChecked} />
                        </label>
                    </div>
                </td>
            </tr>
        )
    });
}

function _tableForm(values) {
    return (
        <table class="mui-table mui-table--bordered">
            <thead>
                <tr>
                    <th>Repositories</th>
                    <th>Show in Panel</th>
                </tr>
            </thead>
            <tbody>
                {_repoTableRows(values)}
            </tbody>
        </table>
    );
};

const MainForm = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  }) => (
    <form onSubmit={handleSubmit} className="mui-form">
        <GithubImageHeader {...values} />
        {_tableForm(values)}
        <div className="mui--bg-danger mui--text-white">{errors.select}</div>
        <button type="submit" disabled={isSubmitting} className={'mui-btn mui-btn--primary mui-btn--raised'}>
            Add Projects
        </button>
    </form>
);


// Wrap our form with the using withFormik HoC
const MyForm = withFormik({
    // Transform outer props into form values
    mapPropsToValues: props => { 
        let selected = {};

        // Populate form values for already selected repos
        if (props.user.selected_repos) {
            props.user.selected_repos.forEach(repo_id => {

                selected[`selected-${repo_id}`] = true;
            });    
        }
        

        return {
            username: props.user.github_user.login,
            avatar_url: props.user.github_user.avatar_url,
            selected_repos: props.user.selected_repos,
            repos: props.user.repos,
            ...selected
        }
    },
    // Add a custom validation function (this can be async too!)
    validate: (values, props) => {
        const errors = {};
        // if (!values.username) {
        //     errors.username = 'Required';
        // } else if (
        //     !/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(values.username)
        // ) {
        //     errors.username = 'Invalid username';
        // }

        return errors;
    },
    setValues: (field) => {
    },
    // Submission handler
    handleSubmit: async (values, { props, setSubmitting, setErrors /* setValues, setStatus, and other goodies */,}
    ) => {
        setSubmitting(true);
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
            let success = await props.onSubmit(formData);
        } else {
            setErrors({ select: 'Must select at least one Github Project'});           
        }
        setSubmitting(false);
    }
  })(MainForm);

export default MyForm;