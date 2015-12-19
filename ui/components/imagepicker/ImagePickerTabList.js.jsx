var ImagePickerTabList = React.createClass({
    getInitialState: function() {
        return {active: 'library'};
    },

    handleClick: function(event) {
        this.setState({active: event.target.id});
        this.props.onTabClick(event.target.id);
    },
    render: function() {
        return (
            <div onClick={this.handleClick} id='image-select-tab-row'>
                <ImagePickerTab active={this.state.active} title='Library' id='library'/>
                <ImagePickerTab active={this.state.active} title='My Images' id='collection'/>
                <ImagePickerTab active={this.state.active} title='Upload' id='upload'/>
                <ImagePickerTab active={this.state.active} title='Image Link' id='url'/>
            </div>
        );
    }
});

var ImagePickerTab = React.createClass({
    render: function() {
        var tabStyle = {
            'fontSize': this.props.active === this.props.id ? '14px' : '12px',
            'float': 'left'
        };
        return <div id={this.props.id} style={tabStyle} className='image-select-tab'>{this.props.title}</div>;
    }
});
