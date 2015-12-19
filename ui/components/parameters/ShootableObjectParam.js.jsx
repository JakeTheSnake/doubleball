var ShootableObjectParam = React.createClass({
    onUpdate: function(name, value) {
        this.props.onUpdate(name, Number(value));
    },
    render: function() {
        var selectables = GameCreator.helpers.getShootableObjectIds();
        return (
            <tbody>
                <DropdownParam name={this.props.name} 
                    value={this.props.value} onUpdate={this.onUpdate} collection={selectables}
                    label='Object'/>
            </tbody>
        );
    }
});
