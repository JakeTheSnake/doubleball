GameCreator.PlatformObject.prototype.getEvents = function() {
  return '<a class="btn tab" data-uifunction="setupOnClickActionsForm">On Click</a> \
          <a class="btn tab" data-uifunction="setupKeyEventsForm">On Keypress</a>';
};

GameCreator.PlatformObject.prototype.getPropertiesForm = function() {
  var result = ' \
  <article> \
    <fieldset class="sequenced"> \
      <div id="object-property-width-container"> \
      </div> \
      <div id="object-property-height-container"> \
      </div> \
    </fieldset> \
    <fieldset class="sequenced"> \
      <div id="object-property-maxSpeed-container"> \
      </div> \
      <div id="object-property-acceleration-container"> \
      </div> \
    </fieldset> \
    <fieldset class="sequenced"> \
      <div id="object-property-accY-container"> \
      </div> \
    </fieldset> \
  </article> \
  <article> \
    <h2>Set default graphic</h2> \
    <fieldset id="image-upload-controls"> \
      <div id="object-property-image-container"> \
      </div> \
    </fieldset> \
    <div id="global-object-image-upload-controls"> \
    </div>';

  return result;
};

GameCreator.PlatformObject.prototype.getSceneObjectForm = function() {
  var result = ' \
  <ul class="parameters"> \
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
        </table> \
      </div> \
    </li> \
  </ul>';

  return result;
};