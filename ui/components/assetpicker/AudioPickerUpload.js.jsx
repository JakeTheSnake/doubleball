var AudioPickerUpload = React.createClass({
    handleUpload: function() {
        var formData = new FormData(document.forms.namedItem('upload_audio_form'));
        var oReq = new XMLHttpRequest();
        var component = this;
        oReq.open("POST", "/audios/upload_audio", true);
        oReq.onload = function() {
            if (oReq.status == 200) {
                component.props.setResult(JSON.parse(this.responseText));
            } else {
                console.log("Error, could not upload audio.");
            }
        };

        oReq.send(formData);
    },
    render: function() {
        return (
            <div className='audio-select-content'>
                <form acceptCharset='UTF-8' encType='multipart/form-data' id='upload_audio_form' method='post'>
                    <div style={{display: 'none'}}>
                        <input name='utf8' type='hidden' value='✓'/>
                        <input name='authenticity_token' type='hidden' value={gon.auth_key}/>
                    </div>
                    <fieldset>
                        <input id='audio_url' name='audio[url]' type='file'/>
                    </fieldset>
                </form>
                <a className='btn success grow upload-audio-button' onClick={this.handleUpload}>{"Upload Audio"}</a>
            </div>

        );
    }
});
