var DialogueLeft = React.createClass({
    render: function() {
        return (
            <div className="dialogue left">
                <div className="panel wide">
                    <div className="panel-header">
                        <span className="panel-title">{this.props.title}</span>
                    </div>
                    <div className="panel-body">{this.props.children}</div>
                </div>
            </div>
        );
    }
});

var GamePropertiesForm = React.createClass({
    getInitialState: function() {
        return {
            shouldSave: false,
            properties: GameCreator.helpers.clone(this.props.properties)
        }
    },
    
    onChange: function(event) {
        var value = Number(event.target.value);
        var max = Number(event.target.dataset.max);
        if (value > 0 && value <= max) {
            this.state.properties[event.target.dataset.prop] = value;
        }
    },

    saveForm: function() {
        GameCreator.UI.updateGameProperties(this.state.properties);
        GameCreator.UI.closeDialogue();
    },

    render: function() {
        return (
            <article>
                <fieldset>
                    <div className="input-container">
                        <input type="text" placeholder="Width" defaultValue={this.state.properties.width} data-prop="width" data-max="32000" onChange={this.onChange}/>
                        <label>Width</label>
                    </div>
                    <div className="input-container">
                        <input type="text" placeholder="Height" defaultValue={this.state.properties.height} data-prop="height" data-max="32000" onChange={this.onChange}/>
                        <label>Height</label>
                    </div>
                    <div className="input-container">
                        <input type="text" placeholder="Viewport Width" defaultValue={this.state.properties.viewportWidth} data-max="4096" data-prop="viewportWidth" onChange={this.onChange}/>
                        <label>Viewport Width</label>
                    </div>
                    <div className="input-container">
                        <input type="text" placeholder="Viewport Height" defaultValue={this.state.properties.viewportHeight} data-max="2160" data-prop="viewportHeight" onChange={this.onChange}/>
                        <label>Viewport Height</label>
                    </div>
                    <div className="btn-group sequenced">
                        <a className="btn success" onClick={this.saveForm}>Save</a>
                        <a className="btn warning" onClick={GameCreator.UI.closeDialogue}>Cancel</a>
                    </div>
                </fieldset>
            </article>
        );
    }
});
