var StateParam = React.createClass({
    getValuePresentation: function(id) {
        if (id === undefined) {
            return '<Edit>';
        } else {
            var selectableStates = this.getSelectableStates();
            var stateNames = Object.keys(selectableStates);
            for (var i = 0; i < stateNames.length; i += 1) {
                if (selectableStates[stateNames[i]] === Number(id)) {
                    return stateNames[i];
                }
            } 
        }
    },
    getSelectableStates: function() {
        var selectedValue = this.props.observedValue,
            globalObj;

        if (this.props.observedValue === 'this') {
            globalObj = GameCreator.UI.state.selectedGlobalItem;
        } else {
            globalObj = GameCreator.helpers.getGlobalObjectById(Number(this.props.observedValue));
        }

        var selectableStates = {};
        if (globalObj !== undefined) {
            globalObj.states.forEach(function(state) {
              selectableStates[state.name] = state.id;
            });
        }
        return selectableStates;
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.props.observedValue !== nextProps.observedValue) {
            this.props.onUpdate(this.props.name, undefined);
        }
    },
    onUpdate: function(name, value) {
        this.props.onUpdate(name, Number(value));
    },
    render: function() {
        var selectableStates = this.getSelectableStates();
        return (
            <tbody>
                <DropdownParam getValuePresentation={this.getValuePresentation} name={this.props.name} 
                    value={this.props.value} onUpdate={this.onUpdate} collection={selectableStates}
                    label='State'/>
            </tbody>
        );
    }
});
