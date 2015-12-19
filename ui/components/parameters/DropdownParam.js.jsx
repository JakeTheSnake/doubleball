var DropdownParam = React.createClass({
    mixins: [GameCreator.CommonParamFunctions],
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
            html = <select className="selectorField" onChange={this.saveValue} onBlur={this.saveValue} defaultValue={this.state.value}>{options}</select>;
        } else {
            html = <span>{this.getValuePresentation(this.state.value)}</span>;
        }
        return  <tr>
                    <td><label>{this.props.label + ':'}</label></td>
                    <td onClick={this.select}>{html}</td>
                </tr>;
    }
});
