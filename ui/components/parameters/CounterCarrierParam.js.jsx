var CounterCarrierParam = React.createClass({
    render: function(){ 
        return (
            <GlobalObjectParam addGlobalCountersOption={true} name={this.props.name} value={this.props.value} onUpdate={this.props.onUpdate}/>
        );
    }
});
