(function() {
    var context = new AudioContext();
    var musicSource;
    var audio = {};
    var musicGainNode = context.createGain();
    var anonymousSource;
    var audioRecorder;

    GameCreator.audioHandler = {
        currentMusic: null,

        addAudio: function(newItem) {
            var existingItem = GameCreator.gameAudio.find((audio) => {
                return newItem.id === audio.id;
            })
            if (!existingItem) {
                GameCreator.gameAudio.push(newItem);
                this.loadAudio([newItem]);
            }
        },

        loadAudio: function(audioList, onLoadCallback) {
            if (audioList.length === 0 && onLoadCallback) {
                onLoadCallback();
            }
            
            var noOfLoadedAudio = 0;
            var loader = () => {
                noOfLoadedAudio += 1;
                if (noOfLoadedAudio >= audioList.length && onLoadCallback) {
                    onLoadCallback();
                }
            };

            audioList.forEach(audioItem => {
                var request = new XMLHttpRequest();
                request.open('GET', audioItem.url, true);
                request.responseType = 'arraybuffer';

                // Decode asynchronously
                request.onload = function() {
                    context.decodeAudioData(request.response, function(buffer) {
                        audio[audioItem.id] = buffer;
                        loader();
                    });
                }
                request.send();    
            })
            
        },

        playSound: function(audioId, playbackRate, volume) {
            var buffer = audio[audioId];
            var source = context.createBufferSource();
            
            if (buffer) {
                if (volume !== 1.0) {
                    var gainNode = context.createGain();
                    gainNode.gain.value = Math.min(1.0, volume);
                    gainNode.connect(context.destination);
                    source.connect(gainNode);
                } else {
                    source.connect(context.destination);
                }
                source.buffer = buffer;
                source.playbackRate.value = playbackRate;
                source.start(0);
            }
        },

        playUrl: function(url, onLoadCallback, onDoneCallback) {
            var request = new XMLHttpRequest();
            anonymousSource = context.createBufferSource();

            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            // Decode asynchronously
            request.onload = function() {
                context.decodeAudioData(request.response, function(buffer) {
                    onLoadCallback();
                    var gainNode = context.createGain();
                    gainNode.gain.value = 0.4;
                    gainNode.connect(context.destination);
                    anonymousSource.connect(gainNode);
                    anonymousSource.buffer = buffer;
                    anonymousSource.onended = onDoneCallback;
                    anonymousSource.start(0);
                });

            }
            request.send();
        },

        playMusic: function(audioId, volume) {
            this.stopMusic();
            var buffer = audio[audioId];
            if (buffer) {
                musicSource = context.createBufferSource();

                if (volume !== 1.0) {
                    musicGainNode.gain.value = Math.min(1.0, volume);
                    musicSource.connect(musicGainNode);
                    musicGainNode.connect(context.destination);
                } else {
                    musicSource.connect(context.destination);
                }
                
                musicSource.buffer = buffer;
                musicSource.start(0);
            }
        },

        stopMusic: function() {
            try {
                musicSource.stop();
            } catch (e) {
                // Music was never started
            }
        },

        stopUrl: function() {
            try {
                anonymousSource.stop();
            } catch (e) {
                // Music was never started
            }
        },

        setupRecording: function(stream) {
            var getUserMedia;
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                getUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
            } else {
                getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
            }
            getUserMedia({
                "audio": true
            }, (stream) => {
                var volume = context.createGain();

                // Create an AudioNode from the stream.
                var input = context.createMediaStreamSource(stream);
                input.connect(volume);

                //audioInput = convertToMono( input );

                audioRecorder = new Recorder(input);
            }, (e) => {
                console.log(e);
            });
        },

        startRecording: function() {
            audioRecorder.clear();
            audioRecorder.record();
        },

        stopRecording: function(getAudioFileCallback) {
            onAudioFileComplete = getAudioFileCallback;
            audioRecorder.stop();
            audioRecorder.getBuffers((buffers) => {
                audioRecorder.exportWAV((blob) => {
                    console.log("Holy shit it worked");
                    Recorder.setupDownload(blob, "myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav" );
                });
            });
        },
    }
}());
