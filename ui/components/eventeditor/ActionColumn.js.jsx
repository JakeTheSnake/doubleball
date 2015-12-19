var ActionColumn = React.createClass({
    onAddActionButtonClick: function() {
        var selectableActionNames = Object.keys(GameCreator.helpers.getSelectableActions(this.props.eventType));
        $(window).trigger("GC.showItemSelector", [selectableActionNames, this.onActionSelected]);
    },
    onActionSelected: function(itemName) {
        var paramNames = Object.keys(GameCreator.actions[itemName].params);
        var parameters = {};
        for (i = 0; i < paramNames.length; i += 1) {
            parameters[paramNames[i]] = GameCreator.actions[itemName].params[paramNames[i]].defaultValue;
        }
        this.props.actions.push(new GameCreator.RuntimeAction(itemName, parameters));
        this.forceUpdate();
    },
    removeAction: function(actionIndex) {
        this.props.actions.splice(actionIndex, 1);
        this.forceUpdate();
    },
    render: function() {
        var actions = [];
        for (var i = 0; i < this.props.actions.length; i += 1) {
            actions.push(
                <ActionItem key={i} onRemove={this.removeAction.bind(this, i)} action={this.props.actions[i]} />
            );
        }
        return (
            <Column title="Do">
                <ul className="parameter-groups">   
                    {actions}
                </ul>
                <a className="btn tab success wide" onClick={this.onAddActionButtonClick}>Add Action</a>
            </Column>
        )
    }
});
