var RangeParam = React.createClass({
    mixins: [GameCreator.CommonParamFunctions],
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
            html = <input type="text" className="rangeField" data-type="range" defaultValue={this.convertValueToString()} onBlur={this.saveValue} onKeyDown={this.keyPressed}/>;
        } else {
            html = <span>{this.getValuePresentation()}</span>;
        }
        return  (<tbody>
                    <tr>
                        <td><label>{GameCreator.helpers.labelize(this.props.name) + ':'}</label></td>
                        <td onClick={this.select}>{html}</td>
                    </tr>
                </tbody>);
    }
});
