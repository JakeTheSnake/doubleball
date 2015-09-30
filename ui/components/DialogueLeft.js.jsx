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
		this.state.properties[event.target.dataset.prop] = event.target.value;
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
						<input type="text" placeholder="Width" defaultValue={this.state.properties.width} data-prop="width" onChange={this.onChange}/>
						<label>Width</label>
					</div>
					<div className="input-container">
						<input type="text" placeholder="Height" defaultValue={this.state.properties.height} data-prop="height" onChange={this.onChange}/>
						<label>Height</label>
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
