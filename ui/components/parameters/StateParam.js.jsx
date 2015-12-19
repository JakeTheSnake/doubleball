var StateParam = React.createClass({
    getInitialState: function() {
        return {
            objId: this.props.value.objId,
            stateId: this.props.value.stateId
        }
    },

    getValuePresentation: function(id) {
        if (id === undefined) {
            return '<Edit>';
        } else {
            var selectableStates = this.getSelectableStates();
            var stateNames = Object.keys(selectableStates);
            for (var i = 0; i < stateNames.length; i += 1) {
                if (selectableStates[stateNames[i]] === Number(id)) {
                    return stateNames[i];
                }
            } 
        }
    },

    getSelectableStates: function() {
        var selectedGlobalObjId = this.state.objId,
            globalObj;

        if (selectedGlobalObjId === 'this') {
            globalObj = GameCreator.UI.state.selectedGlobalItem;
        } else {
            globalObj = GameCreator.helpers.getGlobalObjectById(Number(selectedGlobalObjId));
        }

        var selectableStates = {};
        if (globalObj !== undefined) {
            globalObj.states.forEach(function(state) {
              selectableStates[state.name] = state.id;
            });
        }
        return selectableStates;
    },

    onUpdate: function(name, value) {
        this.props.onUpdate(name, Number(value));
    },

    onUpdateGlobalObj: function(param, globalObj) {
        this.setState({
            objId: globalObj
        });
        this.props.onUpdate(this.props.name, {
            objId: globalObj,
            stateId: this.state.stateId
        });
    },

    onUpdateState: function(param, stateId) {
        this.setState({
            stateId: stateId
        });
        this.props.onUpdate(this.props.name, {
            objId: this.state.objId,
            stateId: stateId,
        });
    },
    render: function() {
        var selectableStates = this.getSelectableStates();
        return (
            <tbody>
                <GlobalObjectParam doNotWrapWithTbody={true} name="object" value={this.state.objId} onUpdate={this.onUpdateGlobalObj} />
                <DropdownParam getValuePresentation={this.getValuePresentation} name='state' 
                    value={this.state.stateId} onUpdate={this.onUpdateState} collection={selectableStates}
                    label='State'/>
            </tbody>
        );
    }
});
