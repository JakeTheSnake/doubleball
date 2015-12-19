var CounterParam = React.createClass({
    getInitialState: function() {
        return {
            carrier: this.props.value.carrier,
            name: this.props.value.name
        }
    },

    getSelectableCounters: function() {
        var counters, selectableCounters = {}, counterNames;
        if (this.state.carrier === 'globalCounters') {
            counters = GameCreator.globalCounters;
        } else if (this.state.carrier === 'this') {
            counters = GameCreator.UI.state.selectedGlobalItem.parentCounters;
        } else {
            counters = GameCreator.helpers.getGlobalObjectById(Number(this.state.carrier));
            counters = counters !== undefined ? counters.parentCounters : {};
        }

        counterNames = Object.keys(counters);
        counterNames.forEach(function(name) {
          selectableCounters[name] = name;
        });
        return selectableCounters;
    },

    onUpdateCarrier: function(param, carrier) {
        this.setState({
            carrier: carrier
        });
        this.props.onUpdate(this.props.name, {
            carrier: carrier,
            name: this.state.name
        });
    },

    onUpdateName: function(param, counterName) {
        this.setState({
            name: counterName
        });
        this.props.onUpdate(this.props.name, {
            name: counterName,
            carrier: this.state.carrier
        });
    },

    render: function() {
        var selectableCounters = this.getSelectableCounters();
        return (
            <tbody>
                <GlobalObjectParam doNotWrapWithTbody={true} addGlobalCountersOption={true} name="Object" value={this.state.carrier} onUpdate={this.onUpdateCarrier}/>
                <DropdownParam name="counter"
                    value={this.state.name} onUpdate={this.onUpdateName} collection={selectableCounters}
                    label='counter'/>
            </tbody>
        );
    }
});
