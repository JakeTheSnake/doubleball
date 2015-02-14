(function() {
  "use strict";
  
  GameCreator.RouteObject.prototype.getEvents = function() {
    return '<a class="btn tab" data-uifunction="setupOnClickActionsForm" title="Actions that will be run when the player\n clicks this object.">On Click</a>';
  };

  GameCreator.RouteObject.prototype.getDescription = function() {
    return "A Route Object is an object that moves along a set of nodes in the game.\
    You can choose to set each node as a turning node (object turns around when it reaches this point).";
  };

  GameCreator.RouteObject.prototype.getPropertiesForm = function() {
    var result = ' \
    <article> \
    <fieldset class="sequenced"> \
      <div id="object-property-width-container" class="input-container"> \
      </div> \
      <div id="object-property-height-container" class="input-container"> \
      </div> \
    </fieldset> \
    <fieldset class="sequenced"> \
      <div id="object-property-speed-container" class="input-container"> \
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

  GameCreator.RouteObject.prototype.getSceneObjectForm = function() {
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
            <span>Speed</span> \
          </div> \
          <table> \
            <tr> \
              <td><label>Speed:</label></td> \
              <td id="side-property-speed" data-inputtype="numberInput"></td> \
            </tr> \
          </table> \
        </div> \
      </li> \
    </ul>';

    return result;
  };
}());