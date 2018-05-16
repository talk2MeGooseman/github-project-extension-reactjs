import React from "react";
import PropTypes from 'prop-types';
import Colors from "../data/colors.json";
import styled from "styled-components";

const H3 = styled.div`
    color: #2096F3;
    font-size: 18px;
    font-weight: bold;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
const Subtext = styled.div`
    font-size: 12px;
    font-style: italic;
    color: #90A4AE;
    flex: 2;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: normal;
`
const Text = styled.div`
    font-size: 12px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-wrap: break-word;
`

const LanguageText = styled.div`
    padding-top: 5px;
    font-size: 10px;
    flex: 1;
`
const Item = styled.div`
    height: 115px;
    display: flex;
    flex-direction: column;
    padding-top: 10px;
    padding-left: 10px;
    border-width: 0px 0px 1px 0px;
    border-style: solid;
    border-color: #CCC;
    background-color: #FFFFFF;
    transition: background-color 0.5s ease;
    cursor: ${props => props.draggable? 'move' : 'pointer' };
    overflow: hidden;
    
    a {
        flex-direction: column;
        display: flex;
        height: 100%;
        color: rgba(0,0,0,.87);

        &:focus, &:hover {
            text-decoration: none;
        }
    }

    &:first-child {
        border-top-width: 0px;
        height: 130px;

        &:before {
            content: '${ props => props.draggable ? '': 'HIGHLIGHTED' }';
            ${ props => props.draggable ? '': 'border: 1px solid #000;' }
            ${ props => props.draggable ? '': 'background-color: #cfd8dc;' }
            border-radius: 7px;
            padding: 0 5px 5px 5px;
            font-weight: bold;
            height: 14px;
            width: 95px;
        }
    }

    &:hover {
        background-color: #BBDEFB;
    }
`;

const PillaMaThing = styled.span`
    position: relative;
    top: 1px;
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${props => props.color};
    margin-right: 3px;
`;

/**
 * ProjectListItem
 * 
 * Component that displays repo row
 * 
 * @param {Object} repo, onClick, draggable
 */
function ProjectListItem ({ repo={}, onClick, draggable}) {
    const pillColor = Colors[repo.language];

    return(
        <Item key={repo.id} draggable={draggable} >
            <a href={repo.html_url} target="_blank">
                <H3>{repo.name}</H3>
                <Text>{repo.full_name}</Text>
                <Subtext>{repo.description}</Subtext>
                <LanguageText><div>{repo.language ? <PillaMaThing color={pillColor} /> : '' }{repo.language}</div></LanguageText>
            </a>
        </Item>
    );
}

ProjectListItem.propTypes = {
    onClick: PropTypes.func,
    draggable: PropTypes.bool,
    repo: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        full_name: PropTypes.string,
        description: PropTypes.string,
        language: PropTypes.string,
    })
};

export default ProjectListItem;