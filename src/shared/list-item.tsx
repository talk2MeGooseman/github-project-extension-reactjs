import { ActionList, LabelGroup, Token } from "@primer/react";
import { RepoIcon, StarIcon } from "@primer/styled-octicons";
import { isNotNil } from "ramda";
import React from "react";
import { SortableGithubRepo } from "../global";

export const ListItem = ({ name, description, language, stargazers_count, chosen }: SortableGithubRepo) => {
  const style = {};

  if (chosen) {
    style['backgroundColor'] = 'bg.primary';
  }

  return (<ActionList.Item
    active={chosen}
    sx={{
      minHeight: '95px',
      cursor: 'move',
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
  </ActionList.Item>);
}
