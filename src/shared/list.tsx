import { ActionList, Avatar, Header, PageLayout } from '@primer/react'
import type { GlobalState } from 'little-state-machine'
import { forwardRef, type PropsWithChildren, useCallback, useState } from 'react'
import type { UseFormSetValue } from 'react-hook-form'
import { ReactSortable } from 'react-sortablejs'
import { useQuery } from 'urql'

import type { SortableRepo } from '../global'
import type { Step3FormValues } from '../views/config/form-components'
import { GithubUserInfo } from './graphql'
import { ListItem } from './list-item'
import classes from './list.module.css'

const SortableActionList = forwardRef<HTMLUListElement, PropsWithChildren>((props, ref) => {
  return (
    <ActionList showDividers ref={ref}>
      {props.children}
    </ActionList>
  )
})
SortableActionList.displayName = 'SortableActionList'

type ListProps =
  | {
      setValue?: UseFormSetValue<Step3FormValues>
      repos: GlobalState['repos']
      username: GlobalState['username']
      disableSorting: true
    }
  | {
      setValue: UseFormSetValue<Step3FormValues>
      repos: GlobalState['repos']
      username: GlobalState['username']
      disableSorting: false
    }

type ListItemFields = {
  id: string
  owner: string
  name: string
  chosen: boolean
  nameWithOwner: string
}

const toListItems = (repos: string[]): ListItemFields[] =>
  repos.map((repo) => {
    const [owner, name] = repo.split('/')
    return { id: repo, owner, name, chosen: false, nameWithOwner: repo }
  })

export const List = ({ setValue, repos, username, disableSorting }: ListProps) => {
  const [userRepos, setUserRepos] = useState<ListItemFields[]>(() => toListItems(repos))
  const [prevRepos, setPrevRepos] = useState(repos)

  if (prevRepos !== repos) {
    setPrevRepos(repos)
    setUserRepos(toListItems(repos))
  }

  const [{ data, fetching }] = useQuery({
    query: GithubUserInfo,
    variables: { username },
  })

  const updateListState = useCallback(
    (list: ListItemFields[]) => {
      setUserRepos(list)
      if (setValue !== undefined) {
        setValue(
          'repos',
          list.map((repo) => repo.nameWithOwner),
        )
      }
    },
    [setValue],
  )

  const renderItem = useCallback(
    (repo: SortableRepo) => <ListItem sortingDisabled={disableSorting} key={repo.id} {...repo} />,
    [disableSorting],
  )

  return (
    <div className={classes.scrollContainer}>
      <Header className={classes.header}>
        {fetching ? (
          <span>Loading...</span>
        ) : (
          <Header.Item>
            <Header.Link
              href={data?.github?.user?.url}
              className={classes.headerLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Avatar src={data?.github?.user?.avatarUrl ?? ''} size={40} className={classes.avatar} />
              <span>{data?.github?.user?.login}</span>
            </Header.Link>
          </Header.Item>
        )}
      </Header>
      <PageLayout padding="none">
        <PageLayout.Content>
          <ReactSortable
            tag={SortableActionList}
            list={userRepos}
            setList={updateListState}
            animation={250}
            disabled={disableSorting}
          >
            {userRepos.map(renderItem)}
          </ReactSortable>
        </PageLayout.Content>
      </PageLayout>
    </div>
  )
}
