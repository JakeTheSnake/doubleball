var Column = React.createClass({
    render: function() {
        return (
            <div className="panel tall">
                <div className="panel-header">
                    <span>{this.props.title}</span>
                </div>
                <div className='btn-group wide'>
                    {this.props.children}
                </div>
            </div>
        );
    }
});

var CounterColumn = React.createClass({
    getInitialState: function() {
        return {
            activeCounter: null,
            activeEvent: null,
            activeCASet: null
        };
    },
    selectCounter: function(name) {
        this.setState({activeCounter: name});
    },
    selectEvent: function(event) {
        this.setState({activeEvent: event});
    },
    selectCASet: function(caSet) {
        this.setState({activeCASet: caSet});
    },
    newCounter: function(name) {
        this.props.counters[name] = new GameCreator.Counter();
        this.setState({activeCounter: name});
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
            caEditor = <EventEditor event={this.state.activeEvent}/>;
        }

        return (
            <div>
                <Column title={this.props.title}>
                    {counterButtons}
                    <AddCounterForm onCreate={this.newCounter}/>
                </Column>
                {eventColumn}
                {caEditor}
            </div>
        );
    }
});

var EventEditor = React.createClass({
    getInitialState: function() {
        return {
            activeWhenGroup: null
        };
    },
    selectWhenGroup: function(index) {
        this.setState({activeWhenGroup: index});
    },
    render: function() {
        var whenGroups = [];
        for (var i = 0; i < this.props.event.length; i += 1) {
            whenGroups.push(
                <WhenGroupItem key={i} whenGroup={this.props.event[i]} selectWhenGroup={this.selectWhenGroup.bind(this, i)} active={i === this.state.activeWhenGroup}/>
            );
        }
        var actionColumn;
        var whenGroupIndex = this.state.activeWhenGroup;
        if (whenGroupIndex !== null) {
            var actions = [];
            for (var i = 0; i < this.props.event[whenGroupIndex].actions.length; i += 1) {
                actions.push(
                    <ActionItem key={i} action={this.props.event[whenGroupIndex].actions[i]} />
                );
            }
            actionColumn = <Column title="Do">{actions}</Column>
        }

        return (
            <div>
                <Column title="When">
                    <ul className="parameter-groups">
                        {whenGroups}
                    </ul>
                </Column>
                {actionColumn}
            </div>
        );
    }
});

var WhenGroupItem = React.createClass({
    getWhenGroupTitle: function() {
        var title = "";
        if (this.props.whenGroup.conditions.length === 0) {
            title = "Always";
        } else {
            var names = [];
            for (i = 0; i < this.props.whenGroup.conditions.length; i+=1) {
                names.push(this.props.whenGroup.conditions[i].name);
            }
            title = names.join(' & '));
        }
        return title;
    }
    render: function() {
        var title = this.getWhenGroupTitle();
        if (this.props.active) {
            var conditions = [];
            for (var i = 0; i < this.props.whenGroup.conditions.length; i += 1) {
                conditions.push(<ConditionItem key={i} condition={this.props.whenGroup.conditions[i]}/>);
            }
            return (
                <li className='active'>
                    <span>{title}</span>
                    <div className="parameter-group">
                        {conditions}
                    </div>
                    <a className="btn edit wide">Add condition</a>
                </li>
            )
        } else {
            return (
                <li>
                    <span>{title}</span>
                </li>
            )
        }
    }
});

var ConditionItem = React.createClass({
    render: function() {
        var params = [];
        var paramNames = Object.keys(this.props.condition.getAllParameters());
        for (var i = 0; i < paramNames.length; i += 1) {
            var paramComponent = this.props.condition.getParameter(paramNames[i]).component;
            params.push(
                <paramComponent key={paramNames[i]} parentCondition={this} parameter={this.props.condition.params[paramNames[i]]} />
            );
        }
        return (
            <div className="parameter-header">
                <span>{this.props.condition.name}</span>
                <a className="btn warning">X</a>
            </div>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <label>Comparator :</label>
                        </td>
                        <td data-inputtype="comparatorInput"><span>greaterThan</span></td>
                        </tr>
                    <tr>
                        <td>
                            <label>Scene :</label>
                        </td>
                        <td data-inputtype="sceneInput"><span>Scene 1</span></td>
                    </tr>
                </tbody>
            </table>
        )
    }
})

var ActionItem = React.createClass({
    render: function() {
        return <div>{this.props.action.name}</div>;
    }
});

var CounterEventColumn = React.createClass({
    getInitialState: function() {
        return {
            activeEvent: null
        };
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
    renderCustomEventButtons: function(eventType) {
        var eventTypes = Object.keys(this.props.counter[eventType]);
        var eventButtons = [];
        for (var i = 0; i < eventTypes.length; i += 1) {
            eventButtons.push(<ColumnButton text={eventType + ": " + eventTypes[i]} onSelect={this.selectCustomEvent.bind(this, eventType, eventTypes[i])} active={this.props.counter[eventType][eventTypes[i]] === this.state.activeEvent}/>)
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
            </Column>
        )
    }
})

var AddCounterForm = React.createClass({
    getInitialState: function() {
        return {
            formOpen: false
        };
    },
    openForm: function() {
        this.setState({formOpen: true});
    },
    closeForm: function() {
        this.setState({formOpen: false});
    },
    saveCounter: function() {
        var counterName = $('#create-counter-form input').val();
        if (counterName !== undefined && counterName !== '') {
            this.props.onCreate(counterName);
        }
        this.closeForm();
    },
    render: function() {
        if (this.state.formOpen) {
            return (
                <div id='create-counter-form'>
                    <input type="text" placeholder="Counter name"/>
                    <div className="btn-group sequenced">
                        <a className="btn success" onClick={this.saveCounter}>Save</a>
                        <a className="btn warning" onClick={this.closeForm}>Cancel</a>
                    </div>
                </div>
            )
        } else {
            return <a className="btn tab success wide" onClick={this.openForm}>Add</a>
        }
    }
})

var ColumnButton = React.createClass({
    select: function(ev) {
        if (this.props.onSelect) {
            this.props.onSelect(this.props.text);
        }
    },
    render: function() {
        var classes = 'btn tab';
        if (this.props.active) classes += ' active';
        return (
            <a className={classes} onClick={this.select}>{this.props.text}</a>
        );
    }
})