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

var EventEditor = React.createClass({
    getInitialState: function() {
        return {
            activeCaSetIndex: 0,
            selectableItemsType: null
        };
    },
    componentWillReceiveProps: function(nextProps) {
        if (nextProps !== this.props) {
            this.setState(this.getInitialState());    
        }
    },
    selectWhenGroup: function(index) {
        this.setState({activeCaSetIndex: index});
    },
    addCaSet: function() {
        this.props.caSets.push(new GameCreator.ConditionActionSet());
        this.forceUpdate();
    },
    onConditionSelected: function(itemName) {
        var activeCaSet = this.props.caSets[this.state.activeCaSetIndex];
        activeCaSet.conditions.push(new GameCreator.RuntimeCondition(itemName));
        this.forceUpdate();
    },
    onAddCondition: function() {
        $(window).trigger("GC.showItemSelector", [Object.keys(GameCreator.helpers.getSelectableConditions()), this.onConditionSelected]);
    },
    
    render: function() {
        var whenGroups = [];
        var actions = [];

        for (var i = 0; i < this.props.caSets.length; i += 1) {
            whenGroups.push(
                <WhenGroupItem key={i} onAddCondition={this.onAddCondition} whenGroup={this.props.caSets[i]} onSelectWhenGroup={this.selectWhenGroup.bind(this, i)} active={i === this.state.activeCaSetIndex}/>
            );
        }
        var whenGroupIndex = this.state.activeCaSetIndex;
        if (whenGroupIndex !== null) {
            actions = this.props.caSets[whenGroupIndex].actions;             
        }

        return (
            <div>
                <Column title="When">
                    <ul className="parameter-groups">
                        {whenGroups}
                    </ul>
                    <a className="btn tab success wide" onClick={this.addCaSet}>Create group</a>
                </Column>
                <ActionColumn actions={actions} eventType={this.props.eventType}/>       
            </div>
        );
    }
});

var ActionColumn = React.createClass({
    onAddActionButtonClick: function() {
        var selectableActionNames = Object.keys(GameCreator.helpers.getSelectableActions(this.props.eventType));
        $(window).trigger("GC.showItemSelector", [selectableActionNames, this.onActionSelected]);
    },
    onActionSelected: function(itemName) {
        this.props.actions.push(new GameCreator.RuntimeAction(itemName));
        this.forceUpdate();
    },
    removeAction: function(actionIndex) {
        this.props.actions.splice(actionIndex, 1);
        this.forceUpdate();
    },
    render: function() {
        var actions = [];
        for (var i = 0; i < this.props.actions.length; i += 1) {
            actions.push(
                <ActionItem key={i} onRemove={this.removeAction.bind(this, i)} action={this.props.actions[i]} />
            );
        }
        return (
            <Column title="Do">
                <ul className="parameter-groups">   
                    {actions}
                </ul>
                <a className="btn tab success wide" onClick={this.onAddActionButtonClick}>Add Action</a>
            </Column>
        )
    }
});

var EventItemSelector = React.createClass({
    
    getInitialState: function(){
        return {
                selectableItems: [],
                callback: undefined
            }
    },

    componentDidMount: function() {
        $(window).on("GC.showItemSelector", function(e, selectableItems, callback) {
            this.setState({
                selectableItems: selectableItems,
                callback: callback
            });
        }.bind(this));

        $(window).on("GC.hideItemSelector", function(e) {
            this.setState({
                selectableItems: [],
                callback: undefined
            });
        }.bind(this));
    },

    onItemSelect: function(itemName) {
        this.state.callback(itemName);
        this.clearSelectableItems();
    },

    clearSelectableItems: function() {
        this.setState({
            selectableItems: [],
            callback: undefined
        });
    },

    componentWillUnmount: function() {
        $(window).off('GC.showItemSelector');
        $(window).off('GC.hideItemSelector');
    },

    render: function() {
        var addNewItemColumn = <div></div>;
        if (this.state.selectableItems.length !== 0) {
            var columnButtons = [];
            for (var i = 0; i < this.state.selectableItems.length; i += 1) {
                columnButtons.push(<ColumnButton key={i} onSelect={this.onItemSelect} text={this.state.selectableItems[i]}/>);
            }
            addNewItemColumn = <Column title="Select Item">{columnButtons}</Column>;
        }

        return addNewItemColumn;
    }
});

var WhenGroupItem = React.createClass({
    getWhenGroupTitle: function() {
        var title = "";
        if (this.props.whenGroup.conditions.length === 0) {
            title = "Always";
        } else {
            var names = [];
            for (var i = 0; i < this.props.whenGroup.conditions.length; i+=1) {
                names.push(this.props.whenGroup.conditions[i].name);
            }
            title = names.join(' & ');
        }
        return title;
    },
    removeCondition: function(conditionIndex) {
        this.props.whenGroup.conditions.splice(conditionIndex, 1);
        this.forceUpdate();
    },
    render: function() {
        var title = this.getWhenGroupTitle();
        if (this.props.active) {
            var conditions = [];
            for (var i = 0; i < this.props.whenGroup.conditions.length; i += 1) {
                conditions.push(<ConditionItem key={i} onRemove={this.removeCondition.bind(this, i)} condition={this.props.whenGroup.conditions[i]}/>);
            }
            if (!conditions.length) {
                conditions.push(<div className="parameter-header"><span>Always</span></div>);
            }
            return (
                <li className='active'>
                    <span>{title}</span>
                    <div className="parameter-group">
                        {conditions}
                    </div>
                    <a className="btn edit wide" onClick={this.props.onAddCondition}>Add condition</a>
                </li>
            )
        } else {
            return (
                <li onClick={this.props.onSelectWhenGroup}>
                    <span>{title}</span>
                </li>
            )
        }
    }
});

var ConditionItem = React.createClass({
    onUpdate: function(paramName, value) {
        this.props.condition.parameters[paramName] = value;
    },
    render: function() {
        var params = [];
        var paramNames = Object.keys(this.props.condition.getAllParameters());
        for (var i = 0; i < paramNames.length; i += 1) {
            var ParamComponent = this.props.condition.getParameter(paramNames[i]).component;
            params.push(
                <ParamComponent key={i} value={this.props.condition.parameters[paramNames[i]]} onUpdate={this.onUpdate} name={paramNames[i]}/>
            );
        }
        return (
            <div>
                <div className="parameter-header">
                    <span>{this.props.condition.name}</span>
                    <a className="btn warning" onClick={this.props.onRemove}>X</a>
                </div>
                <table>
                    <tbody>
                        {params}
                    </tbody>
                </table>
            </div>
        )
    }
});

var ActionItem = React.createClass({
    onUpdate: function(paramName, value) {
        this.props.action.parameters[paramName] = value;
        if (this.props.action.hasObservers(paramName)) {
            this.forceUpdate();
        }
    },
    onUpdateTiming: function(value) {
        this.props.action.timing = value;
    },
    render: function() {
        var params = [];
        var paramNames = Object.keys(this.props.action.getAllParameters());
        var i;
        for (i = 0; i < paramNames.length; i += 1) {
            var ParamComponent = this.props.action.getParameter(paramNames[i]).component;
            var observedValue,
                observedParam = this.props.action.getParameter(paramNames[i]).observes;
            if (observedParam !== undefined) {
                observedValue = this.props.action.parameters[observedParam];
            }
            params.push(
                <ParamComponent key={i} observedValue={observedValue} value={this.props.action.parameters[paramNames[i]]} onUpdate={this.onUpdate} name={paramNames[i]}/>
            );
        }
        params.push(<TimingParam key={i+1} selectableTimings={GameCreator.actions[this.props.action.name].timing} timing={this.props.action.timing} onUpdate={this.onUpdateTiming}/>)
        return (
            <li className="parameter-group">
                <div className="parameter-header">
                    <span>{this.props.action.name}</span>
                    <a className="btn warning" onClick={this.props.onRemove}>X</a>
                </div>
                <table>
                    <tbody>
                        {params}
                    </tbody>
                </table>
            </li>
        );
    }
});

var AddCounterEventForm = React.createClass({
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
    saveEvent: function() {
        var eventType = $('#counter-event-type').val();
        var eventValue = $('#counter-event-value').val();
        if (eventValue !== undefined && eventValue !== '') {
            this.props.onCreate(eventType, eventValue);
        }
        this.closeForm();
    },
    render: function() {
        if (this.state.formOpen) {
            return (
                <div>
                    <select id='counter-event-type' className="selectorField" data-type="string">
                        <option value="atValue">Equals</option>
                        <option value="aboveValue">Larger Than</option>
                        <option value="belowValue">Smaller Than</option>
                    </select>
                    <input id='counter-event-value' type='text' placeholder='Value'/>
                    <div className="btn-group sequenced">
                        <a className="btn success" onClick={this.saveEvent}>Save</a>
                        <a className="btn warning" onClick={this.closeForm}>Cancel</a>
                    </div>
                </div>
            )
        } else {
            return <a className="btn tab success wide" onClick={this.openForm}>Add</a>
        }
    }
});

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
});

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
            <a className={classes} onClick={this.select}>{GameCreator.helpers.labelize(this.props.text)}</a>
        );
    }
});