GameCreator.commonObjectViews = {
  addCommonObjectViews: function(object) {
      object.getEditWindow = GameCreator.commonObjectViews.getEditWindow;
      object.getCountersContent = GameCreator.commonObjectViews.getCountersContent;
      object.getCollisionsContent = GameCreator.commonObjectViews.getCollisionsContent;
      object.getCounterEventsContent = GameCreator.commonObjectViews.getCounterEventsContent;
      object.getPropertiesContent = GameCreator.commonObjectViews.getPropertiesContent;
      object.getStatePropertiesContent = GameCreator.commonObjectViews.getStatePropertiesContent;
      object.getNonStatePropertiesForm = GameCreator.commonObjectViews.getNonStatePropertiesForm;
      object.getStatesContent = GameCreator.commonObjectViews.getStatesContent;
      object.getEventsContent = GameCreator.commonObjectViews.getEventsContent;
      object.getAddGlobalObjectPropertiesContent = GameCreator.commonObjectViews.getAddGlobalObjectPropertiesContent;
      object.getTabs = GameCreator.commonObjectViews.getTabs;
  },

  addPlayerObjectViews: function(object) {
      GameCreator.commonObjectViews.addCommonObjectViews(object);
      object.getKeySelector = GameCreator.commonObjectViews.getKeySelector;
      object.getKeysContent = GameCreator.commonObjectViews.getKeysContent;
  },

  addCounterObjectViews: function(object) {
      object.getPropertiesContent = GameCreator.commonObjectViews.getPropertiesContent;
      object.getStatePropertiesContent = GameCreator.commonObjectViews.getStatePropertiesContent;
      object.getStatesContent = GameCreator.commonObjectViews.getStatesContent;
      object.getAddGlobalObjectPropertiesContent = GameCreator.commonObjectViews.getAddGlobalObjectPropertiesContent;
      object.getEditWindow = GameCreator.commonObjectViews.getEditWindow;
  },

  addTextObjectViews: function(object) {
      object.getPropertiesContent = GameCreator.commonObjectViews.getPropertiesContent;
      object.getStatePropertiesContent = GameCreator.commonObjectViews.getStatePropertiesContent;
      object.getStatesContent = GameCreator.commonObjectViews.getStatesContent;
      object.getAddGlobalObjectPropertiesContent = GameCreator.commonObjectViews.getAddGlobalObjectPropertiesContent;
      object.getEditWindow = GameCreator.commonObjectViews.getEditWindow;
  },

  /* ==========================================================================
     Common object views
     ========================================================================== */

  getEditWindow: function() {
    var result = ' \
    <div class="dialogue bottom"> \
    <div id="object-manager"> \
    <div class="panel-group sequenced clearfix"> \
    <div class="panel-header"> \
    <span>Object Manager</span> \
    <a id="close-dialogue-button" class="btn warning">x</a> \
    </div> \
    <div class="panel tall"> \
      <div class="panel-header"> \
        <span>Library</span> \
      </div>\
      <div id="object-manager-library-preview" class="library-preview"> \
      </div> \
      <div class="library-explorer"> \
        <ul class="global-object-list"> \
        </ul> \
      </div> \
    </div> \
    <div class="panel tall"> \
    <div class="panel-header"> \
    <span>Edit</span> \
    </div>\
    <div id="dialogue-panel-edit" class="btn-group wide">';

    result += this.getTabs();
    result += ' \
    </div> \
    </div> \
    <div id="dialogue-edit-content"> \
    </div> \
    </div> \
    </div> \
    </div>';

    return result;
  },

  getTabs: function() {
    var result = ' \
    <a data-uifunction="setupPropertiesForm" class="btn tab">Properties</a> \
    <a data-uifunction="setupStatesColumn" class="btn tab">States</a> \
    <a data-uifunction="setupEventsForm" class="btn tab">Events</a> \
    <a data-uifunction="setupCountersForm" class="btn tab">Counters</a>'

    return result;
  },

  getCounterEventsContent: function(counterName) {
    var counter = this.parentCounters[counterName];
    var value;
    var result = GameCreator.htmlStrings.counterEventMenuElement("", "onIncrease");
    result += GameCreator.htmlStrings.counterEventMenuElement("", "onDecrease");
    
    for (value in counter.atValue) {
      if (counter.atValue.hasOwnProperty(value)) {
        result += GameCreator.htmlStrings.counterEventMenuElement(value, "atValue");
      }
    };

    for (value in counter.aboveValue) {
      if (counter.aboveValue.hasOwnProperty(value)) {
        result += GameCreator.htmlStrings.counterEventMenuElement(value, "aboveValue");
      }
    };

    for (value in counter.belowValue) {
      if (counter.belowValue.hasOwnProperty(value)) {
        result += GameCreator.htmlStrings.counterEventMenuElement(value, "belowValue");
      }
    };

    result += '<a id="add-new-counter-event-button" class="btn tab success wide">Add</a>';

    return result;
  },

  getCountersContent: function() {
    var result = '';
    var keys = Object.keys(this.parentCounters);

    for (var i = 0; i < keys.length; i++) {
      result += GameCreator.htmlStrings.defaultMenuElement(keys[i]);
    }

    return result;
  },

  getStatesContent: function() {
    var i, result = '';
    
    for (i = 0; i < this.states.length; i++) {
      if(this.states[i].name !== "Default") {
        result += GameCreator.htmlStrings.stateMenuElement(this.states[i].id, this.states[i].name);
      }
    }

    return result;
  },

  getStatePropertiesContent: function(title, id) {
    var result = ' \
    <div class="panel tall large"> \
    <div class="panel-header"> \
    <span>' + title + '</span> \
    </div> \
    <div class="panel-body"> \
    <div id="state-properties-content">';

    result += this.getPropertiesForm();
    result += ' \
    </article> \
    <a class="btn warning grow delete-state-button" data-id="' + id + '">Delete state</a> \
    </div> \
    </div></div>';

    return result;
  },

  getAddGlobalObjectPropertiesContent: function(title) {
    var result = ' \
    <div class="panel tall large"> \
    <div class="panel-header"> \
    <span>' + title + '</span> \
    </div> \
    <div class="panel-body"> \
    <div id="state-properties-content"> \
    <div class="global-object-description"> \
    <span>' + this.getDescription() + '</span> \
    </div> \
    <fieldset> \
    <div id="object-property-name-container" class="input-container"> \
    <input type="text" id="add-global-object-name-input"/> \
    <label>Object name</label> \
    </div> \
    </fieldset> \
    </div>';

    result += this.getPropertiesForm();
    result += ' \
    <div class="btn-group"> \
    <a href="#" id="save-new-global-object-button" class="btn success grow">Save object</a> \
    </div> \
    </article> \
    </div> \
    </div>';

    return result;
  },

  getPropertiesContent: function() {
    var result = ' \
    <div class="panel tall large"> \
    <div class="panel-header"> \
    <span>Properties</span> \
    </div> \
    <div class="panel-body"> \
    <div id="object-properties-content">';

    result += this.getPropertiesForm();
    result += ' \
    </div> \
    <div id="object-non-state-properties-content">';

    result += this.getNonStatePropertiesForm();

    result += ' \
    </div> \
    </div> \
    </div>';

    return result;
  },

  getNonStatePropertiesForm: function() {
    var result = ' \
    <fieldset> \
    <div id="object-property-unique-container" class="checkbox-container clearfix"> \
    </div> \
    </fieldset>';

    return result;
  },

  getEventsContent: function() {
    var result = ' \
    <div class="panel tall"> \
    <div class="panel-header"> \
    <span>Events</span> \
    </div> \
    <div id="dialogue-panel-events" class="btn-group wide"> \
    <a class="btn tab" data-uifunction="setupOnCreateActionsForm" title="Actions that will be run when\n this object is created.">On Create</a> \
    <a class="btn tab" data-uifunction="setupCollisionsForm" title="Actions that will be run when this\n object collides with another object.">On Collide</a> \
    <a class="btn tab" data-uifunction="setupOnDestroyActionsForm" title="Actions that will be run just\n before this object is destroyed.">On Destroy</a>';

    result += this.getEvents();
    result += ' \
    </div> \
    </div> \
    <div id="dialogue-events-content"> \
    </div>';

    return result;
  },

  /* ==========================================================================
   Common player object views
   ========================================================================== */

  getKeySelector: function() {
    var selectableKeys = this.keyPressed;
    var result = '';

    for (var keyName in selectableKeys) {
      if (selectableKeys.hasOwnProperty(keyName) && this.onKeySets[keyName].length === 0) {
        result += '<li class="addKeyObjectElement" data-keyName="' + keyName + '"><span>' + keyName + '</span></div>';
      }
    }

    return result;
  },

  getKeysContent: function() {
    var result = '';

    for (var keyName in this.onKeySets) {
      if (this.onKeySets[keyName].length > 0) {
        result += GameCreator.htmlStrings.keyMenuElement(keyName);
      }
    }

    return result;
  },
}