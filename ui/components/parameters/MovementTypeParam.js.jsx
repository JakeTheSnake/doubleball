var MovementTypeParam = React.createClass({
    render: function() {
        var selectables = {'Relative': 'relative', 'Absolute': 'absolute'};
        return (<tbody>
                    <DropdownParam name={this.props.name} 
                        value={this.props.value} onUpdate={this.props.onUpdate} collection={selectables}
                        label='Type'/>
                </tbody>);
    }
});
