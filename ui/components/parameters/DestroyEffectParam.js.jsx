var DestroyEffectParam = React.createClass({
    render: function() {
        var selectables = GameCreator.effects.destroyEffects;
        return (
            <tbody>
                <DropdownParam name={this.props.name} 
                    value={this.props.value} onUpdate={this.props.onUpdate} collection={selectables}
                    label='Effect'/>
            </tbody>
        );
    }
});
