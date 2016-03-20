var AudioPickerLibrary = React.createClass({
    getInitialState: function() {
        this.categories = GameCreator.audioLibrary.map((category) => {
            return category.name;
        })
        return {selectedCategory: this.categories[0]};
    },
    setCategory: function(content) {
        this.setState({selectedCategory: content});
    },
    selectAudio: function(audioItem) {
        this.props.setResult(audioItem);
    },
    render: function() {
        var currentCategory = GameCreator.audioLibrary.find((category) => {
            return category.name === this.state.selectedCategory;
        });
        var content = currentCategory.audio.map((audio) => {
            return  (
                <AudioItem key={audio.id} onSelect={this.selectAudio.bind(this, audio)} audio={audio}/>
            );
        });

        return (
            <div className='audio-select-content'>
                <AssetCategory onCategoryClick={this.setCategory} categories={this.categories}/>
                <div id='audio-select-library-items'>
                    {content}
                </div>
            </div>
        );
    }
});
