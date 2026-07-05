import { RepoIcon, StarIcon } from '@primer/octicons-react'
import { ActionList, LabelGroup, Text, Token, Truncate } from '@primer/react'
import type { ReactNode } from 'react'
import { useQuery } from 'urql'

import { GithubRepositoryQuery } from './graphql'
import classes from './list.module.css'

export type ListItemProps = {
  sortingDisabled: boolean
  name: string
  owner: string
  chosen: boolean
}

type ItemContent = {
  leadingVisual: ReactNode
  label: ReactNode
  description: ReactNode
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

  // Primer v38 extracts ActionList slots (LeadingVisual, Description) only from
  // DIRECT children of the item — wrapping them in a fragment breaks the layout,
  // so both branches list them inline.
  const content: ItemContent = {
    leadingVisual: <RepoIcon />,
    label: (
      <Truncate title={name || ''} maxWidth={250}>
        {name}
      </Truncate>
    ),
    description: (
      <>
        <Text as="div" className={classes.description}>
          {description}
        </Text>
        <LabelGroup>
          <Token text={stargazerCount} leadingVisual={StarIcon} />
          {(languages ?? [])
            .filter((lang) => lang != null)
            .map((lang) => (
              <Token key={lang.id} text={lang.name} />
            ))}
        </LabelGroup>
      </>
    ),
  }

  if (sortingDisabled) {
    return (
      <ActionList.LinkItem
        href={url ?? undefined}
        target="_blank"
        rel="noopener noreferrer"
        active={chosen}
        className={itemClassName}
      >
        <ActionList.LeadingVisual>{content.leadingVisual}</ActionList.LeadingVisual>
        {content.label}
        <ActionList.Description variant="block">{content.description}</ActionList.Description>
      </ActionList.LinkItem>
    )
  }

  return (
    <ActionList.Item active={chosen} className={itemClassName}>
      <ActionList.LeadingVisual>{content.leadingVisual}</ActionList.LeadingVisual>
      {content.label}
      <ActionList.Description variant="block">{content.description}</ActionList.Description>
    </ActionList.Item>
  )
}
