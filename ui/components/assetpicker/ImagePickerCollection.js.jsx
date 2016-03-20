var ImagePickerCollection = React.createClass({
    getInitialState: function() {
        var request = new XMLHttpRequest();
        var component = this;
        request.open("GET", "/images/all_images", true);
        request.onload = function(event) {
            if (request.status === 200) {
                var response = JSON.parse(this.responseText);
                var images = response.images;
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
    destroyImage: function(imgNumber) {
        var component = this;
        var formData = new FormData();
        formData.append("authenticity_token", gon.auth_key);
        formData.append("image[id]", this.state.images[imgNumber].id);
        var oReq = new XMLHttpRequest();
        oReq.multipart = false;
        oReq.open("POST", "/images/destroy_image", true);
        oReq.onload = function() {
            if (this.responseText === 'OK') {
                var images = component.state.images.slice();
                images.splice(imgNumber, 1);
                component.setState({images: images});
            } else {
                console.log("Error, could not destroy image.");
            }
        };
        oReq.send(formData);
    },
    render: function() {
        var imageButtons = [];
        for (var i = 0; i < this.state.images.length; i += 1) {
            var image = this.state.images[i];
            imageButtons.push(
                <div key={'image'+i} className='image-select-library-image'>
                    <img src={image.url} width='50' height='50' onClick={this.selectImage.bind(this, image.url)}/>
                    <a onClick={this.destroyImage.bind(this, i)}>X</a>
                </div>
            );
        }
        return <div>{imageButtons}</div>;
    }
});
