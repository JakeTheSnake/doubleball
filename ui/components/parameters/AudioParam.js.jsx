var AudioParam = React.createClass({
    getInitialState: function() {
        return {audioId: this.props.value};
    },
    onUpdate: function(value) {
        this.setState({audioId: value});
        this.props.onUpdate(this.props.name, value);
    },
    render: function() {
        var audioItem = GameCreator.gameAudio.find((audio) => {
            return audio.id === this.state.audioId;
        }); 
        var text = audioItem ? audioItem.name : "<Edit>";
        var clickFunc = () => {
            GameCreator.UI.openAudioSelectPopup(this.onUpdate);
        }

        return (
            <tbody>
                <tr>
                    <td><label>Audio:</label></td>
                    <td onClick={clickFunc}><span>{text}</span></td>
                </tr>
            </tbody>
        );
    }
});
