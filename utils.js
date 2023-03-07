const Utils = {
  limitScopes: {
    ALL_WINDOWS: "all-windows",
    ACTIVE_WINDOW: "active-window"
  },

  shouldNotifyOptions: {
    SHOW_NOTIFICATIONS: "true",
    HIDE_NOTIFICATIONS: "false",
  },

  limitStrategies: {
    NO_NEW_TABS: "no-new-tabs",
    REMOVE_LEAST_RECENTLY_ACCESSED: "remove-least-recently-accessed-tab",
    REMOVE_MOST_RECENTLY_ACCESSED: "remove-most-recently-accessed-tab",
    REMOVE_FIRST_TAB: "remove-first-tab",
    REMOVE_LAST_TAB: "remove-last-tab"
  },

  preferences: {
    TAB_LIMIT: "tabLimit",
    LIMIT_STRATEGY: "limitStrategy",
    LIMIT_SCOPE: "limitScope",
    SHOULD_NOTIFY: "shouldNotify"
  }
}

const Defaults = {
    TAB_LIMIT: 47,
    LIMIT_STRATEGY: Utils.limitStrategies.NO_NEW_TABS,
    LIMIT_SCOPE: Utils.limitScopes.ALL_WINDOWS,
    SHOULD_NOTIFY: Utils.shouldNotifyOptions.SHOW_NOTIFICATIONS
  }


window.Utils = Utils;
window.Defaults = Defaults;