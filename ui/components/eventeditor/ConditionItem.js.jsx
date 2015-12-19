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
                    {params}
                </table>
            </div>
        )
    }
});
