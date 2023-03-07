<div align=center><img src=icon.png></div>

# TLX - Tab Limiter eXtended

## What it does

This extension allows the user to limit the number of open tabs. A limit strategy is applied when the limit is passed. It is a fork of gebirgsbaerbel's [max-tab-limit](https://github.com/gebirgsbaerbel/max-tabs-limit).

## Limit Strategies

There are two categories and five types of limit strategies. The categories are static and dynamic limit strategies.  A static limit strategy simply does not allow the creation of new tabs when the limit is reached.  A dynamic limit strategy will remove a tab while allowing tab creation to maintain the limit when the limit is reached. The type of limiting strategy determines which tab will be removed. The limit strategy can be set in the extension's preferences.

<b>No new tabs</b>. When the limit is reached, no new tabs can be added.

<b>Remove least recently accessed tab</b>. When the limit is reached, a new tab will be added and the least recently accessed tab will be removed.

<b>Remove most recently accessed tab</b>. When the limit is reached, a new tab will be added and the most recently accessed tab will be removed.

<b>Remove first tab</b>. When the limit is reached, a new tab will be added and the first tab (as they appear visually) will be removed.

<b>Remove last tab</b>. When the limit is reached, a new tab will be added and the last tab (as they appear visually) will be removed.

## Limit Scope

There are two kinds of limit scopes: *all windows* and *active window*. The limit scope can be set in the extension's preferences.

*All windows* means that the limit will be shared by all windows (including private windows if the extension is allowed to run on private windows). The badge on the extension will also show the number of total open tabs on all windows. For example, if the limit is 10 and window A has 6 tabs open and window B has 4 tabs open, opening another tab on either will activate the limiting strategy. The badge on both windows will read 10.

*Active window* means that each window will have its own limit. Windows do not share a limit i.e. in the previous example, the badge on window A would read 6 and the badge on window B would read 4. Window A can have 4 more tabs while window B can have 4 more tabs.

## Notifications
When limiting is applied, a notification will be shown detailing the limiting strategy used and the url of the tab closed. Notifications can be turned off in the extension's preferences.
