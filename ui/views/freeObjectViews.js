GameCreator.FreeObject.prototype.getEvents = function() {
	return '<a class="btn tab" data-uifunction="setupOnClickActionsForm">On Click</a>';
};

GameCreator.FreeObject.prototype.getPropertiesForm = function() {
  var result = ' \
  <article> \
    <fieldset class="sequenced"> \
      <div id="object-property-width-container" class="input-container"> \
      </div> \
      <div id="object-property-height-container" class="input-container"> \
      </div> \
    </fieldset> \
    <fieldset class="sequenced"> \
      <div id="object-property-speedX-container" class="input-container"> \
      </div> \
      <div id="object-property-speedY-container" class="input-container"> \
      </div> \
    </fieldset> \
    <fieldset class="sequenced"> \
      <div id="object-property-accX-container" class="input-container"> \
      </div> \
      <div id="object-property-accY-container" class="input-container"> \
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

GameCreator.FreeObject.prototype.getSceneObjectForm = function() {
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
            <td><label>Speed X:</label></td> \
            <td id="side-property-speedX" data-inputtype="numberInput"></td> \
          </tr> \
          <tr> \
            <td><label>Speed Y:</label></td> \
            <td id="side-property-speedY" data-inputtype="numberInput"></td> \
          </tr> \
          <tr> \
            <td><label>Acceleration X:</label></td> \
            <td id="side-property-accX" data-inputtype="numberInput"></td> \
          </tr> \
          <tr> \
            <td><label>Acceleration Y:</label></td> \
            <td id="side-property-accY" data-inputtype="numberInput"></td> \
          </tr> \
        </table> \
      </div> \
    </li> \
  </ul>';

  return result;
};

