var AudioPickerRecord = React.createClass({
    stream: null,

    componentWillMount: function() {
        GameCreator.audioHandler.setupRecording();
    },

    getInitialState: function() {
        return {
            recording: 'idle',
            playState: 'unavailable'
        }
    },

    startRecord: function() {
        this.setState({recording: 'recording'});
    },

    stopRecord: function() {
        this.setState({recording: 'idle'});
    },

    render: function() {
        var previewButton;
        if (this.state.playState === 'playing') {
            previewButton = <div className="audio-select-library-item-stop" onClick={GameCreator.audioHandler.stopUrl}>&#9611;</div>;
        } else if (this.state.playState === 'available') {
            previewButton = <div className="audio-select-library-item-play" onClick={this.previewAudio.bind(this, this.props.audio.url)}>&#9658;</div>
        }

        return (
            <div>
                <span>{this.state.playState}</span>
                <span onMouseDown={this.startRecord} onMouseUp={this.stopRecord}>{this.state.recording}</span>
            </div>
        );   
    }
});