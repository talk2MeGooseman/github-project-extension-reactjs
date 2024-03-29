/* eslint-disable primer-react/direct-slot-children */
import { ActionList, LabelGroup, Text, Token, Truncate } from "@primer/react";
import { RepoIcon, StarIcon } from "@primer/styled-octicons";
import React from "react";
import { useQuery } from "urql";
import { GithubRepositoryQuery } from "./graphql";


export type ListItemProps = { sortingDisabled: boolean, name: string, owner: string, chosen: boolean };

export const ListItem = ({ name, chosen, sortingDisabled, owner }: ListItemProps) => {
  const style = {};
  const [{ data, fetching, error }] = useQuery({
    query: GithubRepositoryQuery,
    variables: { name, owner },
  });

  if (chosen) {
    style['backgroundColor'] = 'bg.primary';
  }

  const ItemComponent = sortingDisabled ? ActionList.LinkItem : ActionList.Item;

  if (fetching || error) {
    return (<div>Loading...</div>);
  }

  const {
    description,
    url,
    languages,
    stargazerCount
  } = data?.github?.repository ?? {};

  return (<ItemComponent
    href={sortingDisabled ? url : undefined}
    target="_blank" rel="noopener noreferrer"
    active={chosen}
    sx={{
      minHeight: '95px',
      cursor: sortingDisabled ? undefined : 'move',
      hover: {},
      userSelect: sortingDisabled ? 'auto' : 'none'
    }}>
    <ActionList.LeadingVisual>
      <RepoIcon />
    </ActionList.LeadingVisual>
    <Truncate title={name || ""} sx={{ maxWidth: 250 }}>
      {name}
    </Truncate>
    <Text as="div" sx={{ color: "fg.muted", fontSize: 0, font: 'status-bar', lineHeight: '16px', my: 1 }}>
      {description}
    </Text>
    <ActionList.Description variant='block'>
      <LabelGroup>
        <Token text={stargazerCount} leadingVisual={StarIcon} />
        {languages.map((lang) => <Token key={lang.id} text={lang.name} />)}
      </LabelGroup>
    </ActionList.Description>
  </ItemComponent>);
}
