var ActionItem = React.createClass({
    onUpdate: function(paramName, value) {
        this.props.action.parameters[paramName] = value;
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
            params.push(
                <ParamComponent key={i} value={this.props.action.parameters[paramNames[i]]} onUpdate={this.onUpdate} name={paramNames[i]}/>
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
                    {params}
                </table>
            </li>
        );
    }
});
