var AssetPickerTabList = React.createClass({
    getInitialState: function() {
        return {active: this.props.initialTab};
    },

    handleClick: function(event) {
        this.setState({active: event.target.id});
        this.props.onTabClick(event.target.id);
    },
    render: function() {
        var tabs = [];
        this.props.tabs.forEach((tab) => {
            tabs.push(<AssetPickerTab active={this.state.active} title={tab.title} id={tab.id} key={tab.id}/>);
        })  
        return (
            <div onClick={this.handleClick} id='asset-select-tab-row'>
                {tabs}
            </div>
        );
    }
});

var AssetPickerTab = React.createClass({
    render: function() {
        var tabStyle = {
            'fontSize': this.props.active === this.props.id ? '14px' : '12px',
            'float': 'left'
        };
        return <div id={this.props.id} style={tabStyle} className='image-select-tab'>{this.props.title}</div>;
    }
});
