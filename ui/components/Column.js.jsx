var Column = React.createClass({
    render: function() {
        return (
            <div className="panel tall">
                <div className="panel-header">
                    <span>{this.props.title}</span>
                </div>
                <div className='btn-group wide'>
                    {this.props.children}
                </div>
            </div>
        );
    }
});
