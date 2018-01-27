import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;

    img {
        margin-right: 5px;
        border: 1px solid black;
    }
`

const Image = styled.img`
    max-width: 100px;
`;

const GithubImageHeader = ({avatar_url, username}) => (
    <HeaderContainer className="mui-textfield">
        <Image src={avatar_url} /><h1>{username}</h1>
    </HeaderContainer>
);

GithubImageHeader.propTypes = {
    avatar_url: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
};

export default GithubImageHeader;