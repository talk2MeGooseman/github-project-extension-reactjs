import React, { Component } from 'react';
import styled from 'styled-components';
import Repo from "./Repo";
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend';
import PropTypes from "prop-types";

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;

    img {
        margin-right: 5px;
        border: 1px solid black;
    }
`;

class Step3Form extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        onSubmit: PropTypes.func.isRequired,
    };

    constructor() {
        super();
        this.moveCard = this.moveCard.bind(this);
        this.onClick = this.onClick.bind(this);
    }
    
    componentWillMount() {
        const { user: { selected_repos } } = this.props;

        this.setState({
             selected_repos: selected_repos
        });
    }

    moveCard(dragIndex, hoverIndex) {
        const { selected_repos } = this.state
        const dragCard = selected_repos[dragIndex]

        // Make a copy of the repos array, need to enforce immutable state
        let reposCopy = Object.assign([], selected_repos);

        // Remove item thats being dragged
        reposCopy.splice(dragIndex, 1);
        // Place item after the one that its hovering over
        reposCopy.splice(hoverIndex, 0, dragCard);

        // Update new repo ordering
        this.setState({
            selected_repos: reposCopy    
        });
    }

    async onClick() {
        let { selected_repos } = this.state;
        await this.props.onSubmit(selected_repos);
    }

    render() {
        const { user: { github_user: { avatar_url, login }, repos } } = this.props;
        let { selected_repos } = this.state;

        let selected_repos_data = selected_repos.map((repo_id) => {
            return repos.find((repo_data) => repo_data.id === repo_id );
        });
        debugger;
        return (
            <div>
                <HeaderContainer className="mui-textfield">
                    <img src={avatar_url} /><h1>{login}</h1>
                </HeaderContainer>
                <div class="mui--text-title"><strong>Drag to order projects</strong></div>
                <div class="mui-divider"></div>
                <br />
                {selected_repos_data.map((repo, i) => (
                    <Repo
                        key={repo.id}
                        index={i}
                        id={repo.id}
                        repo={repo}
                        moveCard={this.moveCard}
                    />
                ))}
                <button class="mui-btn mui-btn--raised mui-btn--primary" onClick={this.onClick}>Update</button>
            </div>
        );
    }
}

export default DragDropContext(HTML5Backend)(Step3Form);