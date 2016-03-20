var PercentParam = React.createClass({
    render: function() {
        return <NumberParam value={this.props.value} onUpdate={this.props.onUpdate} name={this.props.name} unit="%"/>;
    }
});
