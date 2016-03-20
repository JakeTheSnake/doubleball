var AudioPickerCollection = React.createClass({
    getInitialState: function() {
        var request = new XMLHttpRequest();
        var component = this;
        request.open("GET", "/audios/all_audios", true);
        request.onload = function(event) {
            if (request.status === 200) {
                var response = JSON.parse(this.responseText);
                var audio = response.audios;
                if (component.isMounted()) {
                    component.setState({audio: audio});
                }
            } else {
                console.log('Loading audio failed!');
            }
        };
        request.send();
        return {audio: [], selectedAudio: null};
    },
    selectAudio: function(audioItem) {
        this.props.setResult(audioItem);
    },
    destroyAudio: function(audioId) {
        var formData = new FormData();
        var component = this;
        formData.append("authenticity_token", gon.auth_key);
        formData.append("audio[id]", audioId);
        var oReq = new XMLHttpRequest();
        oReq.multipart = false;
        oReq.open("POST", "/audios/destroy_audio", true);
        oReq.onload = function(event) {
            if (this.responseText === 'OK') {
                var audio = component.state.audio.filter((item) => {
                    return item.id !== audioId;
                });
                component.setState({audio: audio});
            } else {
                console.log("Error, could not destroy audio.");
            }
        };
        oReq.send(formData);
    },
    previewAudio: function(url) {
        GameCreator.audioHandler.playUrl(url);
    },
    render: function() {
        var content = this.state.audio.map((audio) => {
            return  (
                <div key={audio.id} className='audio-select-library-item'>
                    <div className="audio-select-library-item-name" onClick={this.selectAudio.bind(this, audio)}>{audio.name}</div>
                    <div className="audio-select-library-item-play" onClick={this.previewAudio.bind(this, audio.url)}>&#9658;</div>
                    <a onClick={this.destroyAudio.bind(this, audio.id)}>X</a>
                </div>
            );
        })

        return <div>{content}</div>;
    }
});
