var ComparatorParam = React.createClass({
    render: function() {
        var selectableComparators = { 'Equals': 'equals', 'Greater than': 'greaterThan', 'Less than': 'lessThan'};
        return (
            <tbody>
                <DropdownParam name={this.props.name} 
                    value={this.props.value} onUpdate={this.props.onUpdate} collection={selectableComparators}
                    label='Comparator'/>
            </tbody>
        );
    }
});
