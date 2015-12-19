var CounterTypeParam = React.createClass({
    render: function(){
        var selectableTypes = {'Add': 'add', 'Reduce': 'reduce', 'Set': 'set'};
        return (
            <tbody>
                <DropdownParam name={this.props.name} 
                    value={this.props.value} onUpdate={this.props.onUpdate} collection={selectableTypes}
                    label='Operation'/>
            </tbody>
        );
    }
});
