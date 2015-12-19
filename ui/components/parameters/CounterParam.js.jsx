var CounterParam = React.createClass({
    getSelectableCounters: function() {
        var counters, selectableCounters = {}, counterNames;
        if(this.props.observedValue === 'globalCounters') {
            counters = GameCreator.globalCounters;
        } else if(this.props.observedValue === 'this'){
            counters = GameCreator.UI.state.selectedGlobalItem.parentCounters;
        } else {
            counters = GameCreator.helpers.getGlobalObjectById(Number(this.props.observedValue));
            counters = counters !== undefined ? counters.parentCounters : {};
        }

        counterNames = Object.keys(counters);
        counterNames.forEach(function(name) {
          selectableCounters[name] = name;
        });
        return selectableCounters;
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.props.observedValue !== nextProps.observedValue) {
            this.props.onUpdate(this.props.name, undefined);
        }
    },
    render: function() {
        var selectableCounters = this.getSelectableCounters();
        return (
            <tbody>
                <DropdownParam name={this.props.name} 
                    value={this.props.value} onUpdate={this.props.onUpdate} collection={selectableCounters}
                    label='Counter'/>
            </tbody>
        );
    }
});
