import React from "react";
import styled from "styled-components";

const H3 = styled.div`
    color: #0366d6;
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
    color: #5a5a5a;
    flex: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`
const Text = styled.div`
    font-size: 12px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const LanguageText = styled.div`
    padding-top: 5px;
    font-size: 10px;
    flex: 1;
`
const ProjectListItem = styled.div`
    height: 90px;
    display: flex;
    flex-direction: column;
    padding-left: 10px;
    border-width: 0px 0px 1px 0px;
    border-style: solid;
    border-color: #CCC;
    background-color: #F0F0F0;
    transition: background-color 0.5s ease;
    cursor: ${props => props.cursor ? props.cursor : 'pointer' };
    overflow: hidden;
    
    &:first-child {
        height: 100px;
        border-top-width: 0px;
        background-color: #FFFFFF;

        &:before {
        }
    }

    &:hover {
        background-color: #BBDEFB;
    }
`;

export default function Item({ repo, onClick, cursor = false }) {
    return(
        <ProjectListItem onClick={onClick} cursor={cursor} >
            <H3>{repo.name}</H3>
            <Text>{repo.full_name}</Text>
            <Subtext>{repo.description}</Subtext>
            <LanguageText>{repo.language}</LanguageText>
        </ProjectListItem>
    );
}