var ImagePickerLibrary = React.createClass({
    getInitialState: function() {
        this._categories = Object.keys(GameCreator.imageLibrary);
        return {selectedCategory: this._categories[0], selectedImage: undefined};
    },
    setCategory: function(content) {
        this.setState({selectedCategory: content});
    },
    selectImage: function(imgNumber) {
        this.props.setResult(GameCreator.imageLibrary[this.state.selectedCategory][imgNumber].url);
    },
    render: function() {
        var currentContent = [];
        for (var i = 0; i < GameCreator.imageLibrary[this.state.selectedCategory].length; i += 1) {
            currentContent.push(
                <div key={'image'+i} className='image-select-library-image' onClick={this.selectImage.bind(this, i)}>
                    <img src={GameCreator.imageLibrary[this.state.selectedCategory][i].url}/>
                </div>
            );
        } 
        return (
            <div className='image-select-content'>
                <AssetCategory onCategoryClick={this.setCategory} categories={this._categories}/>
                <div id='image-select-library-images'>
                    {currentContent}
                </div>
            </div>
        );
    }
});
