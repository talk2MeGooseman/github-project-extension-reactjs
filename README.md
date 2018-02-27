# Github Projects Twitch Extension

https://www.twitch.tv/ext/yncbd7i177on3ia536r307nlvt8g1w-0.0.1

## Dependent Backend Repo

https://github.com/talk2MeGooseman/github-project-extension-firebase

## Description

This extension allows a broadcaster the ability to show case Github Projects/Repositories to their channel viewers.

There is a total of 3 steps a broadcaster can go through in order to configure the Github Projects Twitch Extension. The first two steps are required in order for the extension to appear on their channel. During the setup process the broadcaster will also be given a panel preview on the right side so they have visual feedback how their panel will look on their channel.

## Configuration

* Step 1: Github Login (Required)
    * Broadcaster will enter their Github login/username that is a owner or contributor to projects they would like to show case
    * Upon successful submission the user will be brough to step 2
* Step 2: Project/Repository Selection (Required)
    * Broadcaster will be given a list of all the public project/repositories they own or contributor to
    * Broadcast must select repositories they would like to appear in their panel by selecting the checkbox for repositiory/project
    * Once the broadcaster is satisifed with their seleciton they can scroll to the bottom to "Add Projects"
    * After successful submission they will be brought step 3 and the broadcaster can now add the panel to their channel page
    * Since repositories are cached on the EBS after step 1 the broadcaster can refresh the cached repositories/projects by clicking "Refresh Repos"
 * Step 3: Project/Repository Order
     * Once a boradcaster has selected the repositories/projects they would like to show case in their panel they will be given the oppurtunity to arrange the order of the repositories/projects
     * The right panel preview will now update to display how the panel will look to channel viewers
     * A Broadcaster can order the individual repositories/projects by draggin and dropping in the location they would like it to appear in
     * The first project in the list will be automatically tagged with "Highlighted" indicating to panel viewers this is the main project of focus
     * Once the Broadcaster is statisfied with ordering they have choosen they can then scroll down and click "Set Order" to update the order in the panel which will be reflected in the panel preview on the right

Once the extension has been succesfully configured and added to the broadcasters channel page a viewer can see the panel and click on any project to open a window and navigate to it.

## Note
At any point in the configuration process the broadcaster can go back to a previous step to either select a new Github login they would like to use, change the selected projects/repositoreis they would like to display or change the order.