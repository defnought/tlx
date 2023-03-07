/**
 * Update the UI: set the value of the maxTabs textbox.
 */
async function updateUI() {
  browser.storage.local.get(Utils.preferences.TAB_LIMIT).then(updateMaxTabsText, onError);
  browser.storage.local.get(Utils.preferences.LIMIT_STRATEGY).then(updateLimitStrategy, onError);
  browser.storage.local.get(Utils.preferences.LIMIT_SCOPE).then(updateLimitScope, onError);
  browser.storage.local.get(Utils.preferences.SHOULD_NOTIFY).then(updateNotificationOption, onError);
}

/**
 * Save settings to storage.
 */
function saveAllOptions(e) {
  saveOptions();
  saveLimitStrategy();
  saveLimitScope();
  saveNotificationOption();
}

function saveOptions() {
  browser.storage.local.set({
    [Utils.preferences.TAB_LIMIT]: document.querySelector("#tabLimit").value
  }).then(savedSuccessfully, onError);
  //e.preventDefault();
}

function saveLimitStrategy() {
  browser.storage.local.set({
    [Utils.preferences.LIMIT_STRATEGY]: document.querySelector("#limitStrategy").value
  }).then(savedSuccessfully, onError);
}

function saveLimitScope() {
  browser.storage.local.set({
    [Utils.preferences.LIMIT_SCOPE]: document.querySelector("#limitScope").value
  }).then(savedSuccessfully, onError);
}

function saveNotificationOption() {
  browser.storage.local.set({
    [Utils.preferences.SHOULD_NOTIFY]: document.preferencesForm.shouldNotify.value
  }).then(savedSuccessfully, onError);
}

/*
  Log message in case storing settings has been successful.
*/
function savedSuccessfully(e) {
  console.log(`Saved successfully: ${e}`);
}

/*
Generic error logger.
*/
function onError(e) {
  console.error(e);
}

/*
  Set text of maxTabs textField to the current maxTabs value.
*/
function updateMaxTabsText(e) {
  if (e.tabLimit) {
    document.querySelector("#tabLimit").value = e.tabLimit;
  } else {
    document.querySelector("#tabLimit").value = Defaults.TAB_LIMIT;
    saveOptions();
  }
}

function updateLimitStrategy(ls) {
  if (ls.limitStrategy) {
    document.querySelector("#limitStrategy").value = ls.limitStrategy;
  } else {
    document.querySelector("#limitStrategy").value = Defaults.LIMIT_STRATEGY;
    saveLimitStrategy();
  }
}

function updateLimitScope(obj) {
  if (obj.limitScope) {
    document.querySelector("#limitScope").value = obj.limitScope;
  } else {
    document.querySelector("#limitScope").value = Defaults.LIMIT_SCOPE;
    saveLimitScope();
  }
}

function updateNotificationOption(obj) {
  if (obj.shouldNotify) {
    document.preferencesForm.shouldNotify.value = obj.shouldNotify;
  } else {
    document.preferencesForm.shouldNotify.value = Defaults.SHOULD_NOTIFY;
    saveNotificationOption();
  }
}


/**
 * Update the UI when the page loads.
 */
document.addEventListener('DOMContentLoaded', updateUI);
document.querySelector("form").addEventListener("submit", saveAllOptions);
