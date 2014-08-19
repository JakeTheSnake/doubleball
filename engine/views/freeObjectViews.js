GameCreator.FreeObject.prototype.getEvents = function() {
	return  '<li data-uifunction="setupOnClickActionsForm">On Click</li>';
};

GameCreator.FreeObject.prototype.getPropertiesForm = function() {
    var result = ' \
<div class="form-group"> \
    <div id="object-property-width-container" class="form-item"> \
    </div> \
    <div id="object-property-height-container" class="form-item"> \
    </div> \
</div> \
<div class="form-group"> \
    <div id="object-property-speedX-container" class="form-item"> \
    </div> \
    <div id="object-property-speedY-container" class="form-item"> \
    </div> \
</div>\
<div class="form-group"> \
    <div id="object-property-accX-container" class="form-item"> \
    </div> \
    <div id="object-property-accY-container" class="form-item"> \
    </div> \
</div> \
<div class="panel-paragraph"> \
    <h2>Set default graphic</h2> \
    <div class="form-group"> \
        <div id="object-property-image-container" class="form-item"> \
        </div> \
    </div> \
</div>';
    return result;
};

GameCreator.FreeObject.prototype.getSceneObjectForm = function() {
var result = ' \
<div class="panel-paragraph border-bottom"> \
    <h1>Text and images</h1> \
    <p></p> \
</div> \
<div class="panel-paragraph properties-group border-bottom"> \
    <div class="properties-value"> \
        <label>Position</label> \
        <span class="glyphicon icon-position"></span> \
        <table> \
            <tr> \
                <td>X:</td> \
                <td id="scene-object-property-x"></td> \
            </tr> \
            <tr> \
                <td>Y:</td> \
                <td id="scene-object-property-y"></td> \
            </tr> \
        </table> \
    </div> \
    <div class="properties-value"> \
        <label>Size</label> \
        <span class="glyphicon icon-position"></span> \
        <table> \
            <tr> \
                <td>W:</td> \
                <td id="scene-object-property-width"></td> \
            </tr> \
            <tr> \
                <td>H:</td> \
                <td id="scene-object-property-height"></td> \
            </tr> \
        </table> \
    </div> \
</div> \
<div class="panel-paragraph properties-group"> \
    <div class="properties-value"> \
        <label>Acceleration</label> \
        <span class="glyphicon icon-position"></span> \
        <table> \
            <tr> \
                <td>X:</td> \
                <td id="scene-object-property-accX"></td> \
            </tr> \
            <tr> \
                <td>Y:</td> \
                <td id="scene-object-property-accY"></td> \
            </tr> \
        </table> \
    </div> \
    <div class="properties-value"> \
        <label>Speed</label> \
        <span class="glyphicon icon-position"></span> \
        <table> \
            <tr> \
                <td>X:</td> \
                <td id="scene-object-property-speedX"></td> \
            </tr> \
            <tr> \
                <td>Y:</td> \
                <td id="scene-object-property-speedY"></td> \
            </tr> \
        </table> \
    </div> \
</div>'
return result;
};

