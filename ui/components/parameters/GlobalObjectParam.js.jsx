var GlobalObjectParam = React.createClass({
    getValuePresentation: function(id) {
        if (id === undefined || id === "" || (id === 'this' && GameCreator.UI.state.selectedItemType !== 'globalObject')) {
            return '<Edit>';
        } else {
            if (id === 'this') {
                return 'this';
            } else if (id === 'globalCounters'){
                return 'Global';
            }
            return GameCreator.helpers.getGlobalObjectById(Number(id)).objectName;    
        }
    },
    onUpdate: function(name, value) {
        this.props.onUpdate(name, value);
    },
    render: function() {
        var globalObjects = GameCreator.helpers.getGlobalObjectIds(GameCreator.UI.state.selectedItemType === 'globalObject');
        if(this.props.addGlobalCountersOption) {
            globalObjects.Global = 'globalCounters';
        }
        return (
            <tbody>
                <DropdownParam getValuePresentation={this.getValuePresentation} name={this.props.name} 
                    value={this.props.value} onUpdate={this.onUpdate} collection={globalObjects}
                    label='Object'/>
            </tbody>
        );
    }
});
