var CounterEventColumn = React.createClass({
    getInitialState: function() {
        return {
            activeEvent: null
        };
    },
    componentWillReceiveProps: function(nextProps) {
        if (nextProps.counterName !== this.props.counterName) {
            this.setState(this.getInitialState());    
        }
    },
    selectCustomEvent: function(eventType, eventName) {
        this.setState({activeEvent: this.props.counter[eventType][eventName]});
        this.props.selectEvent(this.props.counter[eventType][eventName]);
    },
    selectOnIncrease: function() {
        this.setState({activeEvent: this.props.counter.onIncrease});
        this.props.selectEvent(this.props.counter.onIncrease);
    },
    selectOnDecrease: function() {
        this.setState({activeEvent: this.props.counter.onDecrease});
        this.props.selectEvent(this.props.counter.onDecrease);
    },
    onAddCustomEvent: function(eventType, eventValue) {
        this.props.counter[eventType][eventValue] = [new GameCreator.ConditionActionSet()];
        this.forceUpdate();
    },
    renderCustomEventButtons: function(eventType) {
        var eventTypes = Object.keys(this.props.counter[eventType]);
        var eventButtons = [];
        for (var i = 0; i < eventTypes.length; i += 1) {
            eventButtons.push(<ColumnButton key={i} text={eventType + ": " + eventTypes[i]} onSelect={this.selectCustomEvent.bind(this, eventType, eventTypes[i])} active={this.props.counter[eventType][eventTypes[i]] === this.state.activeEvent}/>)
        }
        return eventButtons;
    },
    render: function() {
        var customEvents = [];
        customEvents = customEvents.concat(this.renderCustomEventButtons('atValue')).
            concat(this.renderCustomEventButtons('belowValue')).
            concat(this.renderCustomEventButtons('aboveValue'));

        return (
            <Column title={this.props.counterName + ' Events'}>
                    <ColumnButton text="On Increase" onSelect={this.selectOnIncrease} active={this.state.activeEvent === this.props.counter.onIncrease} />
                    <ColumnButton text="On Decrease" onSelect={this.selectOnDecrease} active={this.state.activeEvent === this.props.counter.onDecrease} />
                    {customEvents}
                    <AddCounterEventForm onCreate={this.onAddCustomEvent}/>
            </Column>
        )
    }
});
