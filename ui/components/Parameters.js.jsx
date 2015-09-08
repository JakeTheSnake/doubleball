var CommonParamFunctions = {
    getInitialState: function() {
        return {
            selected: false,
            value: this.props.value,
        };
    },
    select: function() {
        this.setState({selected: true});
    },
    saveValue: function() {
        var node = this.getDOMNode();
        var input = $(node).find('select, input');
        var value;

        try {
            value = GameCreator.helpers.getValue(input);
            this.props.onUpdate(this.props.name, value);
            this.setState({value: value});
        } catch (err) {
            GameCreator.UI.createValidationBox(input, err);
        }

        this.setState({selected: false});

    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({
            value: nextProps.value
        });
    },
    componentDidUpdate: function() {
        var node = this.getDOMNode();
        $(node).find('select, input').focus();
        $(node).find('input').select();
    },
};

var DropdownParam = React.createClass({
    mixins: [CommonParamFunctions],
    getValuePresentation: function(value) {
        if (this.props.getValuePresentation) {
            return this.props.getValuePresentation(value);
        } else {
            var keys = Object.keys(this.props.collection);
            for (var i = 0; i < keys.length; i += 1) {
                if (String(this.props.collection[keys[i]]) === String(value)) {
                    return keys[i];
                }
            }
        }
        return "<Edit>";
    },
    render: function() {
        var html;

        if(this.state.selected) {
            var collection = this.props.collection;
            var options = [];
            var names = Object.keys(collection);
            for(var i = 0; i < names.length; i += 1) {
                options.push(<option key={i} value={collection[names[i]]}>{names[i]}</option>);
            }
            html = <select className="selectorField" onBlur={this.saveValue} onChange={this.saveValue} value={this.state.value}>{options}</select>;
        } else {
            html = <span>{this.getValuePresentation(this.state.value)}</span>;
        }
        return  <tr>
                    <td><label>{this.props.label + ':'}</label></td>
                    <td onClick={this.select}>{html}</td>
                </tr>;
    }
});

var GlobalObjectParam = React.createClass({
    getValuePresentation: function(id) {
        if (id === undefined || (id === 'this' && GameCreator.UI.state.selectedItemType !== 'globalObject')) {
            return '<Edit>';
        } else {
            if (id === 'this') {
                return GameCreator.UI.state.selectedGlobalItem.objectName;
            } else if (id === 'globalCounters'){
                return 'Global';
            }
            return GameCreator.helpers.getGlobalObjectById(Number(id)).objectName;    
        }
    },
    onUpdate: function(name, value) {
        this.props.onUpdate(name, value);
    },
    render: function() {
        var globalObjects = GameCreator.helpers.getGlobalObjectIds(GameCreator.UI.state.selectedItemType === 'globalObject');
        if(this.props.addGlobalCountersOption) {
            globalObjects.Global = 'globalCounters';
        }
        return <DropdownParam getValuePresentation={this.getValuePresentation} name={this.props.name} 
                value={this.props.value} onUpdate={this.onUpdate} collection={globalObjects}
                label='Object'/>;
    }
});

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
        var globalObj = GameCreator.helpers.getGlobalObjectById(Number(this.props.observedValue));
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
        return <DropdownParam getValuePresentation={this.getValuePresentation} name={this.props.name} 
                value={this.props.value} onUpdate={this.onUpdate} collection={selectableStates}
                label='State'/>;
    }
});

var ComparatorParam = React.createClass({
    render: function() {
        var selectableComparators = { 'Equals': 'equals', 'Greater than': 'greaterThan', 'Less than': 'lessThan'};
        return <DropdownParam name={this.props.name} 
                value={this.props.value} onUpdate={this.props.onUpdate} collection={selectableComparators}
                label='Comparator'/>;
    }
});

var ShootableObjectParam = React.createClass({
    onUpdate: function(name, value) {
        this.props.onUpdate(name, Number(value));
    },
    render: function() {
        var selectables = GameCreator.helpers.getShootableObjectIds();
        return <DropdownParam name={this.props.name} 
                value={this.props.value} onUpdate={this.onUpdate} collection={selectables}
                label='Object'/>;
    }
});

var DirectionParam = React.createClass({
    render: function() {
        var selectables = GameCreator.directions;
        return <DropdownParam name={this.props.name} 
                value={this.props.value} onUpdate={this.props.onUpdate} collection={selectables}
                label='Direction'/>;
    }
});



var MovementTypeParam = React.createClass({
    render: function() {
        var selectables = {'Relative': 'relative', 'Absolute': 'absolute'};
        return <DropdownParam name={this.props.name} 
                value={this.props.value} onUpdate={this.props.onUpdate} collection={selectables}
                label='Type'/>;
    }
});

var DestroyEffectParam = React.createClass({
    render: function() {
        var selectables = GameCreator.effects.destroyEffects;
        return <DropdownParam name={this.props.name} 
                value={this.props.value} onUpdate={this.props.onUpdate} collection={selectables}
                label='Effect'/>;
    }
});

var SceneParam = React.createClass({
    onUpdate: function(name, value) {
        this.props.onUpdate(name, Number(value));
    },
    render: function() {
        var scenes = GameCreator.helpers.getSelectableScenes();
        return <DropdownParam name={this.props.name} 
                value={this.props.value} onUpdate={this.onUpdate} collection={scenes}
                label='Scene'/>;
    }
});

var NumberParam = React.createClass({
    mixins: [CommonParamFunctions],
    render: function() {
        var html;
        if (this.state.selected) {
            html = <input type="text" className="numberField" data-type="number" defaultValue={this.state.value} onBlur={this.saveValue}/>;
        } else {
            html = <span>{this.state.value}</span>;
        }
        return  <tr>
                    <td><label>{GameCreator.helpers.labelize(this.props.name) + ':'}</label></td>
                    <td onClick={this.select}>{html}</td>
                </tr>;
    }
});

var RangeParam = React.createClass({
    mixins: [CommonParamFunctions],
    getInitialState: function() {
        
    },
    convertValueToString: function() {
        var valueString = '',
            value = this.state.value;

        if (Array.isArray(value)) {
            if (value.length === 1) {
                valueString = value[0];
            }
            else {
                valueString = value[0] + ":" + value[1];
            }
        } else {
            valueString = value;
        }
        return valueString;
    },
    getValuePresentation: function() {
        var value = this.state.value;
        if (value.length === 1) {
            return value[0];
        } else if (value.length === 2) {
            return (value[0] + " to " + value[1]);
        } else {
            return value;
        }
    },
    render: function() {
        var html;
        if (this.state.selected) {
            html = <input type="text" className="rangeField" data-type="range" defaultValue={this.convertValueToString()} onBlur={this.saveValue}/>;
        } else {
            html = <span>{this.getValuePresentation()}</span>;
        }
        return  <tr>
                    <td><label>{GameCreator.helpers.labelize(this.props.name) + ':'}</label></td>
                    <td onClick={this.select}>{html}</td>
                </tr>;
    }
});

var TimingParam = React.createClass({
    getInitialState: function() {
        return {
            type: this.props.timing.type,
            time: this.props.timing.time || 0,
            selected: false
        }
    },
    timingSelected: function() {
        var node = this.getDOMNode();
        var type = $(node).find('select').val();
        this.setState({type: type});
    },
    select: function() {
        var me = this;
        if(!me.state.selected) {
            me.setState({selected: true});
            $(document).on('click.timingParamFocusout', function(){
                var node = me.getDOMNode();
                var select = $(node).find('select');
                var input = $(node).find('input');
                if(!$(select).is(":focus") && !$(input).is(":focus")) {
                    me.saveValue();
                }
            });
        }
    },
    saveValue: function() {
        var node = this.getDOMNode();
        var type = $(node).find('select').val();
        var time = Number($(node).find('input').val());
        this.props.onUpdate({type: type, time: time});
        this.setState({selected: false, type: type, time: time});
        $(document).off('click.timingParamFocusout');
    },
    getDisplayText: function() {
        var result = GameCreator.helpers.labelize(this.state.type);
        if (this.state.type !== 'now') {
            result += ' ' + this.state.time;
        }
        return result;
    },
    render: function() {
        var html;
        if (this.state.selected) {
            var typeSelection;
            var valueInput;
            var collection = this.props.selectableTimings;
            var options = [];
            var names = Object.keys(collection);
            options.push(<option value='now'>now</option>);
            for(var i = 0; i < names.length; i += 1) {
                if(collection[names[i]]) {
                    options.push(<option key={i} value={names[i]}>{names[i]}</option>);
                }
            }
            typeSelection = <select className="selectorField" onChange={this.timingSelected} value={this.state.type}>{options}</select>;
            if (this.state.type !== 'now') {
                valueInput = <input type="text" className="numberField" data-type="number" defaultValue={this.state.time}/>
            }
            html = [typeSelection, valueInput];

        } else {
            html = <span>{this.getDisplayText()}</span>;
        }
        return  <tr>
                    <td><label>Timing:</label></td>
                    <td onClick={this.select}>{html}</td>
                </tr>;
    }
});

var CounterCarrierParam = React.createClass({
    render: function(){ 
        return <GlobalObjectParam addGlobalCountersOption={true} name={this.props.name} value={this.props.value} onUpdate={this.props.onUpdate}/>;
    }
});

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
        return <DropdownParam name={this.props.name} 
                value={this.props.value} onUpdate={this.props.onUpdate} collection={selectableCounters}
                label='Counter'/>;
    }
});

var CounterTypeParam = React.createClass({
    render: function(){
        var selectableTypes = {'Add': 'add', 'Reduce': 'reduce', 'Set': 'set'};
        return <DropdownParam name={this.props.name} 
                value={this.props.value} onUpdate={this.props.onUpdate} collection={selectableTypes}
                label='Operation'/>;
    }
})