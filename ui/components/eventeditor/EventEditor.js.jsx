var EventEditor = React.createClass({
    getInitialState: function() {
        return {
            activeCaSetIndex: 0,
            selectableItemsType: null
        };
    },
    componentWillReceiveProps: function(nextProps) {
        if (nextProps !== this.props) {
            this.setState(this.getInitialState());
        }
    },
    selectWhenGroup: function(index) {
        this.setState({activeCaSetIndex: index});
        $(window).trigger('GC.hideItemSelector');
    },
    addCaSet: function() {
        this.props.caSets.push(new GameCreator.ConditionActionSet());
        this.forceUpdate();
    },
    onConditionSelected: function(itemName) {
        var activeCaSet = this.props.caSets[this.state.activeCaSetIndex];
        var paramNames = Object.keys(GameCreator.conditions[itemName].params);
        var parameters = {};
        for (var i = 0; i < paramNames.length; i+=1) {
            parameters[paramNames[i]] = GameCreator.conditions[itemName].params[paramNames[i]].defaultValue;
        }
        activeCaSet.conditions.push(new GameCreator.RuntimeCondition(itemName, parameters));
        this.forceUpdate();
    },
    onAddCondition: function() {
        $(window).trigger("GC.showItemSelector", [Object.keys(GameCreator.helpers.getSelectableConditions()), this.onConditionSelected]);
    },
    
    render: function() {
        var whenGroups = [];
        var actions = [];

        for (var i = 0; i < this.props.caSets.length; i += 1) {
            whenGroups.push(
                <WhenGroupItem key={i} onAddCondition={this.onAddCondition} whenGroup={this.props.caSets[i]} onSelectWhenGroup={this.selectWhenGroup.bind(this, i)} active={i === this.state.activeCaSetIndex}/>
            );
        }
        var whenGroupIndex = this.state.activeCaSetIndex;
        if (whenGroupIndex !== null) {
            actions = this.props.caSets[whenGroupIndex].actions;             
        }

        return (
            <div>
                <Column title="When">
                    <ul className="parameter-groups">
                        {whenGroups}
                    </ul>
                    <a className="btn tab success wide" onClick={this.addCaSet}>Create group</a>
                </Column>
                <ActionColumn actions={actions} eventType={this.props.eventType}/>       
            </div>
        );
    }
});
