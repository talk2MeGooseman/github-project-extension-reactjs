import React from 'react';
import { withFormik, Field } from 'formik';
import styled from 'styled-components';
const regex = /^selected-(\d+)/;

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;

    img {
        margin-right: 5px;
        border: 1px solid black;
    }
`

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
        <HeaderContainer className="mui-textfield">        
            <img src={values.avatar_url} /><h1>{values.username}</h1> 
        </HeaderContainer>
        {_tableForm(values)}
        <div className="mui--bg-danger mui--text-white">{errors.select}</div>
        <button type="submit" disabled={isSubmitting} className={'mui-btn mui-btn--primary mui-btn--raised'}>
            Submit
        </button>
    </form>
);

function _displaySaveConfirmation() {
    // initialize modal element
    var modalEl = document.createElement('div');
    modalEl.innerHTML = '<div style="padding-top: 25%;height: 100%;" class="mui--align-middle mui--text-center"><h1>Submitting...</h1></div>';
    modalEl.style.width = '400px';
    modalEl.style.height = '300px';
    modalEl.style.margin = '100px auto';
    modalEl.style.backgroundColor = '#fff';

    // show modal
    window.mui.overlay('on', modalEl);
}

function _hideOverlay() {
    window.mui.overlay('off');   
}

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
            repos: props.repos,
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
        debugger
    },
    // Submission handler
    handleSubmit: async (values, { props, setSubmitting, setErrors /* setValues, setStatus, and other goodies */,}
    ) => {
        setSubmitting(true);
        _displaySaveConfirmation();
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
        _hideOverlay();
        setSubmitting(false);
    }
  })(MainForm);

export default MyForm;