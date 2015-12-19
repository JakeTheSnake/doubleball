var DialogueBottom = React.createClass({
    render: function() {
        return (
            <div className='dialogue bottom'>
                <div className='panel-group sequenced clearfix'>
                    <div className='panel-header'>
                        <span>{this.props.title}</span>
                        <a id='close-dialogue-button' className='btn warning'>x</a>
                    </div>
                    {this.props.children}
                </div>
            </div>  
        );
    }
});

var GlobalCounterDialogueBottom = React.createClass({
    addNewCounter: function(name) {
        if (GameCreator.globalCounters[name] === undefined) {
            GameCreator.createGlobalCounter(name);
            this.forceUpdate();
        }
    },
    onSelectCounter: function(counterName) {
        GameCreator.UI.setSelectedGlobalCounter(GameCreator.globalCounters[counterName]);
    },
    render: function() {
        return (
            <DialogueBottom title="Global Counters">
                <CountersEditor counters={GameCreator.globalCounters} onSelectCounter={this.onSelectCounter} onAddCounter={this.addNewCounter} eventType="globalcounter" title="Counters"/>
            </DialogueBottom>
        );
    }
});
