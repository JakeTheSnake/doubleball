var ImagePickerUpload = React.createClass({
    handleUpload: function() {
        var formData = new FormData(document.forms.namedItem('upload_image_form'));
        var oReq = new XMLHttpRequest();
        var component = this;
        oReq.open("POST", "/images/upload_image", true);
        oReq.onload = function() {
            if (oReq.status == 200) {
                console.log(this.responseText);
                component.props.setResult(this.responseText);
            } else {
                console.log("Error, could not upload image.");
            }
        };

        oReq.send(formData);
    },
    render: function() {
        return (
            <div className='image-select-content'>
                <form acceptCharset='UTF-8' encType='multipart/form-data' id='upload_image_form' method='post'>
                    <div style={{display: 'none'}}>
                        <input name='utf8' type='hidden' value='✓'/>
                        <input name='authenticity_token' type='hidden' value={gon.auth_key}/>
                    </div>
                    <fieldset>
                        <input id='image_url' name='image[url]' type='file'/>
                    </fieldset>
                </form>
                <a className='btn success grow upload-image-button' onClick={this.handleUpload}>{"Upload Image"}</a>
            </div>

        );
    }
});
