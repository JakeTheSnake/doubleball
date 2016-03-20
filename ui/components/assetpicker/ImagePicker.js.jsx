var ImagePicker = React.createClass({
    tabs: [
        {title: 'Library', id: 'library'},
        {title: 'My Images', id: 'collection'},
        {title: 'Upload', id: 'upload'},
        {title: 'Image Link', id: 'url'},
    ],
    getInitialState: function() {
        return {activeView: 'library'};
    },
    switchTab: function(tab) {
        this.setState({activeView: tab});
    },
    setResult: function(url) {
        this.props.input.val(url);
        this.props.input.trigger('blur');
        $('.selected-image-preview').attr('src', url);
        GameCreator.UI.closeAssetSelectPopup($(this.props.parent));
    },
    render: function() {
        var activeContent;
        if (this.state.activeView === 'library') {
            activeContent = <ImagePickerLibrary setResult={this.setResult}/>;
        } else if (this.state.activeView === 'collection') {
            activeContent = <ImagePickerCollection setResult={this.setResult}/>
        } else if (this.state.activeView === 'upload') {
            activeContent = <ImagePickerUpload setResult={this.setResult}/>
        } else if (this.state.activeView === 'url') {
            activeContent = <ImagePickerUrl setResult={this.setResult}/>
        }
        return (
            <div style={{'display': 'block'}}>
                <AssetPickerTabList onTabClick={this.switchTab} initialTab='library' tabs={this.tabs}/>
                {activeContent}
            </div>
            );
    }
});
