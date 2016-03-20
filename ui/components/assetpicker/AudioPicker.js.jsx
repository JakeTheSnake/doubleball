var AudioPicker = React.createClass({
    tabs: [
        {title: 'Library', id: 'library'},
        {title: 'My Audio', id: 'collection'},
        {title: 'Upload', id: 'upload'},
    ],
    getInitialState: function() {
        return {activeView: 'library'};
    },
    switchTab: function(tab) {
        this.setState({activeView: tab});
    },
    setResult: function(audioItem) {
        GameCreator.audioHandler.addAudio(audioItem);
        this.props.callback(audioItem.id);
        GameCreator.UI.closeAssetSelectPopup($(this.props.parent));
    },
    render: function() {
        var activeContent;
        if (this.state.activeView === 'library') {
            activeContent = <AudioPickerLibrary setResult={this.setResult}/>;
        } 
        else if (this.state.activeView === 'collection') {
            activeContent = <AudioPickerCollection setResult={this.setResult}/>
        } 
        else if (this.state.activeView === 'upload') {
            activeContent = <AudioPickerUpload setResult={this.setResult}/>
        }
        return (
            <div style={{'display': 'block'}}>
                <AssetPickerTabList onTabClick={this.switchTab} initialTab='library' tabs={this.tabs}/>
                {activeContent}
            </div>
        );
    }
});
