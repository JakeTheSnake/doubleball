var NumberParam = React.createClass({
    mixins: [GameCreator.CommonParamFunctions],
    render: function() {
        var html;
        if (this.state.selected) {
            html = <input type="text" className="numberField" data-type="number" defaultValue={this.state.value} onBlur={this.saveValue}/>;
        } else {
            html = <span>{this.state.value}</span>;
        }
        return  (<tbody>
                    <tr>
                        <td><label>{GameCreator.helpers.labelize(this.props.name) + ':'}</label></td>
                        <td onClick={this.select}>{html}</td>
                    </tr>
                </tbody>);
    }
});
