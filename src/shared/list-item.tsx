/* eslint-disable primer-react/direct-slot-children */
import { ActionList, LabelGroup, Token } from "@primer/react";
import { RepoIcon, StarIcon } from "@primer/styled-octicons";
import { isNotNil } from "ramda";
import React from "react";
import { SortableGithubRepo } from "../global";


type ListItemProps = SortableGithubRepo & { sortingDisabled: boolean };

export const ListItem = ({ name, description, language, stargazers_count, chosen, sortingDisabled, html_url }: ListItemProps) => {
  const style = {};

  if (chosen) {
    style['backgroundColor'] = 'bg.primary';
  }

  const ItemComponent = sortingDisabled ? ActionList.LinkItem : ActionList.Item;

  return (<ItemComponent
    href={sortingDisabled ? undefined : html_url}
    active={chosen}
    sx={{
      minHeight: '95px',
      cursor: sortingDisabled ? undefined : 'move',
      hover: {}
    }}>
    <ActionList.LeadingVisual>
      <RepoIcon />
    </ActionList.LeadingVisual>
    {name}
    <ActionList.Description variant='block'>
      <div>
        {description}
      </div>
      <LabelGroup>
        { isNotNil(language) && <Token text={language} /> }
        <Token text={stargazers_count} leadingVisual={StarIcon} />
      </LabelGroup>
    </ActionList.Description>
  </ItemComponent>);
}
