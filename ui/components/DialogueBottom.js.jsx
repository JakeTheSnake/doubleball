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
        GameCreator.globalCounters[name] = new GameCreator.Counter();
        this.forceUpdate();
    },
    render: function() {
        return (
            <DialogueBottom title="Global Counters">
                <CountersEditor counters={GameCreator.globalCounters} onAddCounter={this.addNewCounter} title="Counters"/>
            </DialogueBottom>
        );
    }
});