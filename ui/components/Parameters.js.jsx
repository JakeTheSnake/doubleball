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
                    <td onClick={this.select}><span>{html}</span></td>
                </tr>;
    }
});