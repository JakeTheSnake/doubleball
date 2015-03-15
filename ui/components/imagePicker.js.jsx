var ImagePicker = React.createClass({
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
        GameCreator.UI.closeImageSelectPopup($(this.props.parent));
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
                <ImagePickerTabList onTabClick={this.switchTab}/>
                {activeContent}
            </div>
            );
    }
});

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

var ImagePickerUpload = React.createClass({
    handleUpload: function() {
        var formData = new FormData(document.forms.namedItem('new_image'));
        var oReq = new XMLHttpRequest();
        oReq.open("POST", "/images/upload_image", true);
        oReq.onload = function() {
            if (oReq.status == 200) {
                console.log(this.responseText);
                this.props.setResult(this.responseText);
            } else {
                console.log('Error, coudl not upload image.');
            }
        };

        oReq.send(formData);
    },
    render: function() {
        var request = new XMLHttpRequest();
        request.open("GET", "/images/upload_image_form", true);
        request.onload = function() {
            if (request.status === 200) {
                $('#form-container').html(this.responseText);
            } else {
                console.log('Error, could not load form.')
            }
        };
        request.send();
        return (
            <div className='image-select-content'>
                <div id='preview-image'></div>
                <div id='form-container'></div>
                <a className="btn success grow upload-image-button" onClick={this.handleUpload}>{'Upload Image'}</a>
            </div>

        );
    }
});

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
                <LibraryCategory onCategoryClick={this.setCategory} categories={this._categories}/>
                <div id='image-select-library-images'>
                    {currentContent}
                </div>
            </div>
        );
    }
});

var LibraryCategory = React.createClass({
    getInitialState: function() {
        return {selectedCategory: 0};
    },
    switchCategory: function(number) {
        this.props.onCategoryClick(this.props.categories[number]);
        this.setState({selectedCategory: number});
    },
    render: function() {
        var categoryButtons = [];
        for (var i = 0; i < this.props.categories.length; i += 1) {
            var cssClasses = 'image-select-library-category' + (this.state.selectedCategory === i ? ' active' : '');
            categoryButtons.push(
                <div key={'category'+i} className={cssClasses} onClick={this.switchCategory.bind(this,i)}>
                    {GameCreator.helpers.labelize(this.props.categories[i])}
                </div>
            );
        }
        return <div id='image-select-library-categories'>{categoryButtons}</div>;
    }
});

var ImagePickerCollection = React.createClass({
    getInitialState: function() {
        var request = new XMLHttpRequest();
        var component = this;
        request.open("GET", "/images/all_images", true);
        request.onload = function(event) {
            if (request.status === 200) {
                var response = JSON.parse(this.responseText);
                var images = [];
                for (var i = 0; i < response.images.length; i++) {
                    images.push(
                        <div key={'image'+i} className='image-select-library-image' onClick={component.selectImage.bind(component, response.images[i].url)}>
                            <img src={response.images[i].url} width='50' height='50'/>
                        </div>
                    );
                }
                if (component.isMounted()) {
                    component.setState({images: images});
                }
            } else {
                console.log('Loading images failed!');
            }
        };
        request.send();
        return {images: [], selectedImage: null};
    },
    selectImage: function(url) {
        this.props.setResult(url);
    },
    render: function() {
        return <div>{this.state.images}</div>;
    }
});

var ImagePickerUrl = React.createClass({
    setResult: function() {
        this.props.setResult($('#image-select-url-input').val());
    },
    render: function() {
        return (
            <div>
                <input id="image-select-url-input" type="text"/>
                <a className="btn success grow save-selected-image-button" onClick={this.setResult}>Save</a>
            </div>
        );
    }
})


