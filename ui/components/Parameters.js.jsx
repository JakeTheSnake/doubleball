var CommonParamFunctions = {
    getInitialState: function() {
        return {
            selected: false,
            value: this.props.value
        };
    },
    select: function() {
        this.setState({selected: true});
    },
    saveValue: function() {
        var node = this.getDOMNode();
        var value = $(node).find('select, input').val();
        this.setState({selected: false, value: value});
        this.props.onUpdate(this.props.name, value);
    },
    componentDidUpdate: function() {
        var node = this.getDOMNode();
        $(node).find('select, input').focus();
        $(node).find('input').select();
    },
};

var DropdownParam = React.createClass({
    mixins: [CommonParamFunctions],
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
            html = <span>{this.props.getValuePresentation(this.state.value)}</span>;
        }
        return  <tr>
                    <td><label>{this.props.label + ':'}</label></td>
                    <td onClick={this.select}>{html}</td>
                </tr>;
    }
});

var GlobalObjectParam = React.createClass({
    getValuePresentation: function(id) {
        if (id === undefined) {
            return '<Edit>';
        } else {
            return GameCreator.helpers.getGlobalObjectById(id).objectName;    
        }
    },
    onUpdate: function(name, value) {
        this.props.onUpdate(name, Number(value));
    },
    render: function() {
        var globalObjects = GameCreator.helpers.getGlobalObjectIds();
        return <DropdownParam getValuePresentation={this.getValuePresentation} name={this.props.name} 
                value={this.props.value} onUpdate={this.onUpdate} collection={globalObjects}
                label='Object'/>;
    }
});

var ComparatorParam = React.createClass({
    getValuePresentation: function(value) {
        return GameCreator.helpers.labelize(value);
    },
    render: function() {
        var selectableComparators = { 'Equals': 'equals', 'Greater than': 'greaterThan', 'Less than': 'lessThan'};
        return <DropdownParam getValuePresentation={this.getValuePresentation} name={this.props.name} 
                value={this.props.value} onUpdate={this.props.onUpdate} collection={selectableComparators}
                label='Comparator'/>;
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
                    <td><label>Count:</label></td>
                    <td onClick={this.select}>{html}</td>
                </tr>;
    }
});

var TimingParam = React.createClass({
    getInitialState: function() {
        return {
            type: this.props.timing.type,
            value: this.props.timing.value || 0,
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
        var value = $(node).find('input').val();
        this.props.onUpdate({type: type, value: value});
        this.setState({selected: false, type: type, value: value});
        $(document).off('click.timingParamFocusout');
    },
    getDisplayText: function() {
        var result = GameCreator.helpers.labelize(this.state.type);
        if (this.state.type !== 'now') {
            result += ' ' + this.state.value;
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
                valueInput = <input type="text" className="numberField" data-type="number" defaultValue={this.state.value}/>
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