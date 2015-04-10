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