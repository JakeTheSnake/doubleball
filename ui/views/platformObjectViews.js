GameCreator.PlatformObject.prototype.getEvents = function() {
  return '<a class="btn tab" data-uifunction="setupOnClickActionsForm" title="Actions that will be run when the player\n clicks this object.">On Click</a> \
          <a class="btn tab" data-uifunction="setupKeyEventsForm" title="Actions that will be run on this object\n when a player presses a certain key.">On Keypress</a>';
};

GameCreator.PlatformObject.prototype.getDescription = function() {
  return "A Platform Object is a player controlled object that can fall down, jump,\
    as well as move left and right. It is steered with the arrow keys.";
};

GameCreator.PlatformObject.prototype.getPropertiesForm = function() {
  var result = ' \
  <article> \
    <fieldset class="sequenced"> \
      <div id="object-property-width-container" class="input-container"> \
      </div> \
      <div id="object-property-height-container" class="input-container"> \
      </div> \
    </fieldset> \
    <fieldset class="sequenced"> \
      <div id="object-property-maxSpeed-container" class="input-container"> \
      </div> \
      <div id="object-property-acceleration-container" class="input-container"> \
      </div> \
    </fieldset> \
    <fieldset class="sequenced"> \
      <div id="object-property-accY-container" class="input-container"> \
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

GameCreator.PlatformObject.prototype.getSceneObjectForm = function() {
  var result = ' \
  <ul class="parameter-groups"> \
    <li> \
      <div class="parameter"> \
        <div class="parameter-header"> \
          <span>Size and Position</span> \
        </div> \
        <table> \
          <tr> \
            <td><label>Width:</label></td> \
            <td id="side-property-width" data-inputtype="rangeInput"></td> \
          </tr> \
          <tr> \
            <td><label>Height:</label></td> \
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
          <span>Speed and Acceleration</span> \
        </div> \
        <table> \
          <tr> \
            <td><label>Speed Limit:</label></td> \
            <td id="side-property-maxSpeed" data-inputtype="rangeInput"></td> \
          </tr> \
          <tr> \
            <td><label>Acceleration:</label></td> \
            <td id="side-property-acceleration" data-inputtype="numberInput"></td> \
          </tr> \
          <tr> \
            <td><label>Gravity:</label></td> \
            <td id="side-property-accY" data-inputtype="numberInput"></td> \
          </tr> \
        </table> \
      </div> \
    </li> \
  </ul>';

  return result;
};