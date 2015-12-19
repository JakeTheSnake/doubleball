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
                conditions.push(<div key={"Always"} className="parameter-header"><span>Always</span></div>);
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
