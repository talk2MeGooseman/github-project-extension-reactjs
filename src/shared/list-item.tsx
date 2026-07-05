/* eslint-disable primer-react/direct-slot-children */
import { RepoIcon, StarIcon } from '@primer/octicons-react'
import { ActionList, LabelGroup, Text, Token, Truncate } from '@primer/react'
import { useQuery } from 'urql'

import { GithubRepositoryQuery } from './graphql'
import classes from './list.module.css'

export type ListItemProps = {
  sortingDisabled: boolean
  name: string
  owner: string
  chosen: boolean
}

export const ListItem = ({ name, chosen, sortingDisabled, owner }: ListItemProps) => {
  const [{ data, fetching, error }] = useQuery({
    query: GithubRepositoryQuery,
    variables: { name, owner },
  })

  if (fetching || error) {
    return <div>Loading...</div>
  }

  const { description, url, languages, stargazerCount } = data?.github?.repository ?? {}

  const itemClassName = sortingDisabled ? classes.item : `${classes.item} ${classes.sortableItem}`

  const sharedContent = (
    <>
      <ActionList.LeadingVisual>
        <RepoIcon />
      </ActionList.LeadingVisual>
      <Truncate title={name || ''} maxWidth={250}>
        {name}
      </Truncate>
      <Text as="div" className={classes.description}>
        {description}
      </Text>
      <ActionList.Description variant="block">
        <LabelGroup>
          <Token text={stargazerCount} leadingVisual={StarIcon} />
          {(languages ?? [])
            .filter((lang) => lang != null)
            .map((lang) => (
              <Token key={lang.id} text={lang.name} />
            ))}
        </LabelGroup>
      </ActionList.Description>
    </>
  )

  if (sortingDisabled) {
    return (
      <ActionList.LinkItem
        href={url ?? undefined}
        target="_blank"
        rel="noopener noreferrer"
        active={chosen}
        className={itemClassName}
      >
        {sharedContent}
      </ActionList.LinkItem>
    )
  }

  return (
    <ActionList.Item active={chosen} className={itemClassName}>
      {sharedContent}
    </ActionList.Item>
  )
}
