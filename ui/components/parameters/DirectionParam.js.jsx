var DirectionParam = React.createClass({
    getInitialState: function() {
        this.globalObjects = GameCreator.helpers.getGlobalObjectIds();
        this.selectables = GameCreator.directions;
        return {
            type: this.props.value.type,
            target: this.props.value.target
        }
    },

    onUpdateType: function(name, type) {
        this.setState({
            type: type
        });
        this.props.onUpdate(name, {
            type: type,
            target: this.state.target
        });
    },

    onUpdateTarget: function(name, target) {
        this.setState({
            target: target
        });
        this.props.onUpdate(name, {
            type: this.state.type,
            target: target
        });
    },

    render: function() {
        var target;
        var type = <DropdownParam name={this.props.name} 
            value={this.state.type} onUpdate={this.onUpdateType} collection={this.selectables}
            label='Direction'/>;

        if (this.state.type === 'Towards') {
            target = <DropdownParam name={this.props.name} 
            value={this.state.target} onUpdate={this.onUpdateTarget} collection={this.globalObjects}
            label='Target'/>;
        }
        return <tbody>{type}{target}</tbody>;

    }
});
