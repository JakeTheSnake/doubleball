(function() {
  "use strict";

  var counterDisplayPrototypeFunctions = {
    getNonStatePropertiesForm: function() {
      return  '';
    },

    getEvents: function() {
      return  '';
    },

    getTabs: function() {
      var result = ' \
      <a class="btn tab" data-uifunction="setupPropertiesForm">Properties</a> \
      <a class="btn tab" data-uifunction="setupStatesColumn">States</a>';

      return result;
    },
  };

  $.extend(GameCreator.CounterDisplayText.prototype, counterDisplayPrototypeFunctions);
  $.extend(GameCreator.CounterDisplayImage.prototype, counterDisplayPrototypeFunctions);

  GameCreator.CounterDisplayText.prototype.getPropertiesForm = function() {
    var result = ' \
    <article> \
      <fieldset class="sequenced"> \
        <div id="object-property-font-container" class="input-container"> \
        </div> \
        <div id="object-property-size-container" class="input-container"> \
        </div> \
      </fieldset> \
      <fieldset class="sequenced"> \
        <div id="object-property-color-container" class="input-container"> \
        </div> \
      </fieldset>';

    return result;
  };

  GameCreator.CounterDisplayImage.prototype.getDescription = function() {
    return "This object displays a counter value as symbols. To attach a counter,\
    drag the created object to the scene and select it, and edit the Scene Object Properties.";
  };

  GameCreator.CounterDisplayImage.prototype.getPropertiesForm = function() {
    var result = ' \
    <article> \
      <fieldset class="sequenced"> \
        <div id="object-property-width-container" class="input-container"> \
        </div> \
        <div id="object-property-height-container" class="input-container"> \
        </div> \
      </fieldset> \
    </article> \
    <article> \
      <h2>Set default graphic</h2> \
      <div id="object-property-image-container" class="input-container hidden"> \
      </div> \
      <div id="global-object-image-upload-controls"> \
      </div>';

    return result;
  };


  GameCreator.CounterDisplayText.prototype.getDescription = function() {
    return "This object displays a counter value as a number. To attach a counter,\
    drag the created object to the scene and select it, and edit the Scene Object Properties.";
  };

  GameCreator.CounterDisplayText.prototype.getSceneObjectForm = function() {
    var result = ' \
    <ul class="parameter-groups"> \
      <li> \
        <div class="parameter"> \
          <div class="parameter-header"> \
            <span>Position</span> \
          </div> \
          <table> \
            <tr> \
              <td><label>Position X:</label></td> \
              <td id="side-property-x" data-inputtype="numberInput"></td> \
            </tr> \
            <tr> \
              <td><label>Position Y:</label></td> \
              <td id="side-property-y" data-inputtype="numberInput"></td> \
            </tr> \
          </table> \
        </div> \
      </li> \
      <li> \
        <div class="parameter"> \
          <div class="parameter-header"> \
            <span>Appearance</span> \
          </div> \
          <table> \
            <tr> \
              <td><label>Font:</label></td> \
              <td id="side-property-font" data-inputtype="stringInput"></td> \
            </tr> \
            <tr> \
              <td><label>Font Size:</label></td> \
              <td id="side-property-size" data-inputtype="numberInput"></td> \
            </tr> \
            <tr> \
              <td><label>Color:</label></td> \
              <td id="side-property-color" data-inputtype="stringInput"></td> \
            </tr> \
          </table> \
        </div> \
      </li> \
      <li> \
        <div class="parameter"> \
          <div class="parameter-header"> \
            <span>Source Counter</span> \
            <a class="btn edit" title="Select the object and belonging counter\nwhich holds the value you want to display.">?</a> \
          </div> \
          <table> \
            <tr> \
              <td><label>Object:</label></td> \
              <td id="side-property-counterCarrier" data-inputtype="counterCarrierInput"></td> \
            </tr> \
            <tr> \
              <td><label>Counter:</label></td> \
              <td id="side-property-counterName" data-inputtype="sceneObjectCounterInput" data-dependancy="counterCarrier"></td> \
            </tr> \
          </table> \
        </div> \
      </li> \
    </ul>';

    return result;
  };

  GameCreator.CounterDisplayImage.prototype.getSceneObjectForm = function() {
    var result = ' \
    <ul class="parameter-groups"> \
      <li> \
        <div class="parameter"> \
          <div class="parameter-header"> \
            <span>Size and Position</span> \
          </div> \
          <table> \
            <tr> \
              <td><label>Width X:</label></td> \
              <td id="side-property-width" data-inputtype="rangeInput"></td> \
            </tr> \
            <tr> \
              <td><label>Height Y:</label></td> \
              <td id="side-property-height" data-inputtype="rangeInput"></td> \
            </tr> \
            <tr> \
              <td><label>Position X:</label></td> \
              <td id="side-property-x" data-inputtype="numberInput"></td> \
            </tr> \
            <tr> \
              <td><label>Position Y:</label></td> \
              <td id="side-property-y" data-inputtype="numberInput"></td> \
            </tr> \
          </table> \
        </div> \
      </li> \
      <li> \
        <div class="parameter"> \
          <div class="parameter-header"> \
            <span>Source Counter</span> \
            <a class="btn edit" title="Select the object and belonging counter\nwhich holds the value you want to display.">?</a> \
          </div> \
          <table> \
            <tr> \
              <td><label>Object:</label></td> \
              <td id="side-property-counterCarrier" data-inputtype="counterCarrierInput"></td> \
            </tr> \
            <tr> \
              <td><label>Counter:</label></td> \
              <td id="side-property-counterName" data-inputtype="sceneObjectCounterInput" data-dependancy="counterCarrier"></td> \
            </tr> \
          </table> \
        </div> \
      </li> \
    </ul>';

    return result;
  };
}());
