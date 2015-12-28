var CountersEditor = React.createClass({
    getInitialState: function() {
        return {
            activeCounter: null,
            activeEvent: null,
            activeCASet: null
        };
    },
    componentWillReceiveProps: function(nextProps) {
        if (nextProps !== this.props) {
            this.setState(this.getInitialState());    
        }
    },
    selectCounter: function(name) {
        this.setState({activeCounter: name, activeEvent: null, activeCASet: null});
        if (this.props.onSelectCounter) {
            this.props.onSelectCounter(name);
        }
    },
    selectEvent: function(event) {
        this.setState({activeEvent: event, activeCASet: null});
        $(window).trigger('GC.hideItemSelector');
    },
    selectCASet: function(caSet) {
        this.setState({activeCASet: caSet});
    },
    render: function() {
        var counterButtons = [];
        var counterNames = Object.keys(this.props.counters);
        for (var i = 0; i < counterNames.length; i += 1) {
            counterButtons.push(<ColumnButton key={i} text={counterNames[i]} active={counterNames[i] === this.state.activeCounter} onSelect={this.selectCounter}/>);
        }

        var eventColumn;
        if (this.state.activeCounter) {
            eventColumn = <CounterEventColumn counterName={this.state.activeCounter} counter={this.props.counters[this.state.activeCounter]} selectEvent={this.selectEvent}/>;
        }

        var caEditor;
        if (this.state.activeEvent) {
            caEditor = <EventEditor caSets={this.state.activeEvent} eventType={this.props.eventType}/>;
        }

        return (
            <div>
                <Column title={this.props.title}>
                    {counterButtons}
                    <AddCounterForm onCreate={this.props.onAddCounter}/>
                </Column>
                {eventColumn}
                {caEditor}
                <EventItemSelector/>
            </div>
        );
    }
});
