GameCreator.MouseObject.prototype.getEvents = function() {
  return '<a class="btn tab" data-uifunction="setupKeyEventsForm">On Keypress</a>';
};

GameCreator.MouseObject.prototype.getPropertiesForm = function(stateId) {
  var result = ' \
  <article> \
    <fieldset class="sequenced"> \
      <div id="object-property-width-container" class="input-container"> \
      </div> \
      <div id="object-property-height-container" class="input-container"> \
      </div> \
    </fieldset> \
    <fieldset class="sequenced"> \
      <div id="object-property-minX-container" class="input-container"> \
      </div> \
      <div id="object-property-minY-container" class="input-container"> \
      </div> \
    </fieldset> \
    <fieldset class="sequenced"> \
      <div id="object-property-maxX-container" class="input-container"> \
      </div> \
      <div id="object-property-maxY-container" class="input-container"> \
      </div> \
    </fieldset> \
  </article> \
  <article> \
    <h2>Set default graphic</h2> \
    <fieldset id="image-upload-controls"> \
      <div id="object-property-image-container" class="input-container"> \
      </div> \
    </fieldset> \
    <div id="global-object-image-upload-controls"> \
    </div>';

  return result;
};

GameCreator.MouseObject.prototype.getSceneObjectForm = function() {
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
          <span>Boundaries</span> \
        </div> \
        <table> \
          <tr> \
            <td><label>Min X:</label></td> \
            <td id="side-property-minX" data-inputtype="numberInput"></td> \
          </tr> \
          <tr> \
            <td><label>Min Y:</label></td> \
            <td id="side-property-minY" data-inputtype="numberInput"></td> \
          </tr> \
          <tr> \
            <td><label>Max X:</label></td> \
            <td id="side-property-maxX" data-inputtype="numberInput"></td> \
          </tr> \
          <tr> \
            <td><label>Max Y:</label></td> \
            <td id="side-property-maxY" data-inputtype="numberInput"></td> \
          </tr> \
        </table> \
      </div> \
    </li> \
  </ul>';

  return result;
};