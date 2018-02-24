import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const STEP_1 = 1;
const STEP_2 = 2;
const STEP_3 = 3;

const HeaderTable = styled.table`
    width: 100%;

    td:first-child, td:last-child {
        cursor: pointer;
        width: 10%;
    }
`;

function ConfigAppBar({step, user, goStep1, goStep2, goStep3}) {
    let title = '';
    let leftNavButton = <td className="mui--appbar-height mui--text-center" />
    let rightNavButton = <td className="mui--appbar-height mui--text-center" />

    // Left Nav Button
    if (step === STEP_2) {
        leftNavButton = <td className="mui--appbar-height mui--text-center mui--divider-right" onClick={goStep1}><div class="mui--text-button">Back</div></td>;

        if (user.selected_repos && user.selected_repos.length > 0) {
            rightNavButton = <td className="mui--appbar-height mui--text-center mui--divider-left" onClick={goStep3}><div class="mui--text-button">Step 3</div></td>
        }

        title = 'Select Your Repositories';
    } else if (step === STEP_3) {
        leftNavButton = <td className="mui--appbar-height mui--text-center mui--divider-right" onClick={goStep2}><div class="mui--text-button">Back</div></td>
        title = 'Order Your Projects';
    } else if (step === STEP_1) {
        title = 'Enter Your GitHub Username';
    }

    // Right Nav Buttons
    if (user && step === STEP_1) {
        rightNavButton = <td className="mui--appbar-height mui--text-center mui--divider-left" onClick={goStep2}><div class="mui--text-button">Step 2</div></td>
    }

    return (
        <div className="mui-appbar">
            <HeaderTable>
                <tr>
                    {leftNavButton}
                    <td className="mui--appbar-height mui--text-center">
                        <div className="mui--text-headline">{title}</div>
                    </td>
                    {rightNavButton}
                </tr>
            </HeaderTable>
        </div>
    );
};

ConfigAppBar.propTypes = {
    step: PropTypes.number,
    user: PropTypes.object,
    goStep1: PropTypes.func,
    goStep2: PropTypes.func,
    goStep3: PropTypes.func,
};

export default ConfigAppBar;