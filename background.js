var tabLimit;
var limitStrategy;
var limitScope;
var shouldNotify;

/*
Update the browser when the number of tabs changes.
Update the badge. Including text and color.
Notify user, when too many tabs were opened.
*/
function updateCount(tabId, isOnRemoved) {
  let scope = {};
  if (limitScope == Utils.limitScopes.ACTIVE_WINDOW) {
    scope = { currentWindow: true };
  }
  browser.tabs.query(scope)
    .then((tabs) => {
      let length = tabs.length;

      if (tabId == undefined) {
        updateBadge(length);
        return;
      }

      // onRemoved fires too early and the count is one too many.
      // see https://bugzilla.mozilla.org/show_bug.cgi?id=1396758
      if (isOnRemoved && tabId && tabs.map((t) => { return t.id; }).includes(tabId)) {
        length--;
      }
      // Only limit number of tabs other than preferences
      isPreferencesWindow = tabId.title == null || tabId.title.includes("about");
      isNewTabWindow = tabId.title != null && tabId.title.includes("about:newTab");
      // Do not block any about pages except for newTab. about:home and about:welcome are also blocked as they start an about:newTab page first.
      isBlockable = !isPreferencesWindow || isNewTabWindow;
      if (!isOnRemoved && length > tabLimit && isBlockable) {
        let message;
        switch (limitStrategy) {
          case Utils.limitStrategies.NO_NEW_TABS:
            message = 'No new tabs can be opened';
            browser.tabs.remove(tabId.id);
            break;
          case Utils.limitStrategies.REMOVE_LEAST_RECENTLY_ACCESSED:
            tabs.sort(function (a, b) { return a.lastAccessed - b.lastAccessed })
            message = `Least recently accessed tab removed.\n${tabs[0].url.substring(0, 140)} closed.`;
            browser.tabs.remove(tabs[0].id);
            break;
          case Utils.limitStrategies.REMOVE_MOST_RECENTLY_ACCESSED:
            tabs.sort(function (a, b) { return b.lastAccessed - a.lastAccessed })
            message = `Most recently accessed tab removed.\n${tabs[0].url.substring(0, 140)} closed.`;
            browser.tabs.remove(tabs[0].id);
            break;
          case Utils.limitStrategies.REMOVE_FIRST_TAB:
            message = `First tab removed.\n${tabs[0].url.substring(0, 140)} closed.`;
            browser.tabs.remove(tabs[0].id);
            break;
          case Utils.limitStrategies.REMOVE_LAST_TAB:
            message = `Last tab removed.\n${tabs[length - 1].url.substring(0, 140)} closed.`;
            browser.tabs.remove(tabs[length - 1].id);
            break;
        }
        if (shouldNotify == "true") {
          let content = `Tab Limit reached. Limiting activated.`;
          browser.notifications.create({
            "type": "basic",
            "iconUrl": browser.runtime.getURL("icons/link-48.png"),
            "title": content,
            "message": message
          });
        }
      }

      updateBadge(length);
    });
}

/*
Display tab count on badge and switch color depending on how close user is to maxTabs limit.
*/
function updateBadge(length) {
  switch (limitScope) {
    case Utils.limitScopes.ALL_WINDOWS:
      browser.windows.getAll().then(function (windowInfoArray) {
        if (windowInfoArray.length == 1) {
          setBadge(windowInfoArray[0].id, length);
        } else {
          setBadgeGlobally(length);
        }
      }, onError);
      break;
    case Utils.limitScopes.ACTIVE_WINDOW:
      browser.windows.getCurrent().then(function (windowInfo) {
        setBadge(windowInfo.id, length)
      }, onError);
      break;
  }
}

function setBadge(windowId, length) {
  browser.browserAction.setBadgeText({ text: length.toString(), 'windowId': windowId });
  if (length > tabLimit * 0.7) {
    browser.browserAction.setBadgeBackgroundColor({ 'color': 'red', 'windowId': windowId });
  } else if (length > tabLimit * 0.3) {
    browser.browserAction.setBadgeBackgroundColor({ 'color': 'yellow', 'windowId': windowId });
  } else {
    browser.browserAction.setBadgeBackgroundColor({ 'color': 'green', 'windowId': windowId });
  }
}

function setBadgeGlobally(length) {
  browser.browserAction.setBadgeText({ text: length.toString() });
  if (length > tabLimit * 0.7) {
    browser.browserAction.setBadgeBackgroundColor({ 'color': 'red' });
  } else if (length > tabLimit * 0.3) {
    browser.browserAction.setBadgeBackgroundColor({ 'color': 'yellow' });
  } else {
    browser.browserAction.setBadgeBackgroundColor({ 'color': 'green' });
  }
}

/*
Generic error logger. Called when number of maxTabs could not be retrieved for any reason.
Instead then use default value.
*/
function onError(e) {
  console.error(e);
  setDefaultTabLimit();
}

/*
  Called when saving maxTabs value was not successfull.
*/
function onSaveError(e) {
  console.error(e);
}

/*
  Log message in case storing settings has been successfull.
*/
function savedSuccessfully(e) {
  console.log(`Saved successfully: ${e}`);
}

/*
Retrieved information of maxTabs setting from storage.
*/
function retrievedTabLimit(value) {
  // If maxTabs value is set use it, otherwise use default value.
  if (value.tabLimit) {
    tabLimit = value.tabLimit;
  } else {
    setDefaultTabLimit();
  }
}

function retrievedLimitStrategy(value) {
  if (value.limitStrategy) {
    limitStrategy = value.limitStrategy;
  } else {
    setDefaultLimitStrategy();
  }
}

function retrievedLimitScope(value) {
  if (value.limitScope) {
    limitScope = value.limitScope;
  } else {
    setDefaultLimitScope();
  }
}

function retrievedNotificationOption(value) {
  if (value.shouldNotify) {
    shouldNotify = value.shouldNotify;
  } else {
    setDefaultNotificationOption();
  }
}

function setDefaultTabLimit() {
  tabLimit = Defaults.TAB_LIMIT;
  browser.storage.local.set({
    [Utils.preferences.TAB_LIMIT]: tabLimit
  }).then(savedSuccessfully, onSaveError);
}

function setDefaultLimitStrategy() {
  limitStrategy = Defaults.LIMIT_STRATEGY;
  browser.storage.local.set({
    [Utils.preferences.LIMIT_STRATEGY]: limitStrategy
  }).then(savedSuccessfully, onSaveError);
}

function setDefaultLimitScope() {
  limitScope = Defaults.LIMIT_SCOPE;
  browser.storage.local.set({
    [Utils.preferences.LIMIT_SCOPE]: limitScope
  }).then(savedSuccessfully, onSaveError);
}

function setDefaultNotificationOption() {
  shouldNotify = Defaults.SHOULD_NOTIFY
  browser.storage.local.set({
    [Utils.preferences.SHOULD_NOTIFY]: shouldNotify
  }).then(savedSuccessfully, onSaveError);
}

/*
Retrieve the value of maxTabs from storage and update the UI accordingly.
*/
function retrieveMaxTabsValue() {
  browser.storage.local.get(Utils.preferences.TAB_LIMIT).then(retrievedTabLimit, onError);
  browser.tabs.query({})
    .then((tabs) => {
      let length = tabs.length;
      updateBadge(length);
    });
}


function retrieveLimitStrategy() {
  browser.storage.local.get(Utils.preferences.LIMIT_STRATEGY).then(retrievedLimitStrategy, onError);
}

function retrieveLimitScope() {
  browser.storage.local.get(Utils.preferences.LIMIT_SCOPE).then(retrievedLimitScope, onError);
}

function retrieveNotificationOption() {
  browser.storage.local.get(Utils.preferences.SHOULD_NOTIFY).then(retrievedNotificationOption, onError);
}

function getPreferences() {
  // Receive initial value for preferences
  browser.storage.local.get(Utils.preferences.TAB_LIMIT).then(retrievedTabLimit, onError);
  browser.storage.local.get(Utils.preferences.LIMIT_STRATEGY).then(retrievedLimitStrategy, onError);
  browser.storage.local.get(Utils.preferences.LIMIT_SCOPE).then(retrievedLimitScope, onError);
  browser.storage.local.get(Utils.preferences.SHOULD_NOTIFY).then(retrievedNotificationOption, onError);
}

function retrievePreferences() {
  retrieveMaxTabsValue();
  retrieveLimitStrategy();
  retrieveLimitScope();
  retrieveNotificationOption();
}

function addStorageListeners() {
  // Listen to changes of preferences
  browser.storage.onChanged.addListener(retrieveMaxTabsValue);
  browser.storage.onChanged.addListener(retrieveLimitStrategy);
  browser.storage.onChanged.addListener(retrieveLimitScope);
  browser.storage.onChanged.addListener(retrieveNotificationOption);
}

/*
Listen to when user adds or removes tabs, windows and permissions
*/
browser.tabs.onRemoved.addListener(
  (tabId) => {
    updateCount(tabId, true);
  });
browser.tabs.onCreated.addListener(
  (tabId) => {
    updateCount(tabId, false);
  });
browser.windows.onCreated.addListener(updateCount);
browser.windows.onRemoved.addListener(updateCount);
browser.permissions.onAdded.addListener(updateCount);
browser.permissions.onRemoved.addListener(updateCount);
browser.storage.onChanged.addListener(retrievePreferences);

getPreferences();
document.addEventListener('DOMContentLoaded', updateCount);
