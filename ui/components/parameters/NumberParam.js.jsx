var NumberParam = React.createClass({
    mixins: [GameCreator.CommonParamFunctions],
    render: function() {
        var html;
        var unit = "";
        if (this.props.unit) {
            unit = this.props.unit;
        }

        if (this.state.selected) {
            html = <input type="text" className="numberField" data-type="number" defaultValue={this.state.value} onBlur={this.saveValue}/>;
        } else {
            html = <span>{"" + this.state.value + "" + unit}</span>;
        }
        return  (<tbody>
                    <tr>
                        <td><label>{GameCreator.helpers.labelize(this.props.name) + ':'}</label></td>
                        <td onClick={this.select}>{html}</td>
                    </tr>
                </tbody>);
    }
});
