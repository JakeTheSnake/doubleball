(function() {
    "use strict";

    GameCreator.audioLibrary = [
        { 
            name: 'music',
            audio: [
                {id: 1, name: 'What To Choose?', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/music/what_to_choose.mp3'},
                {id: 2, name: 'Fairy Woods', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/music/fairy_woods.mp3'},
                {id: 3, name: 'The Village', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/music/the_village.mp3'},
                {id: 4, name: 'Space Adventure', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/music/space_adventure.mp3'},
                {id: 5, name: 'Keep Fighting', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/music/keep_fighting.mp3'}
            ]
        },
        { 
            name: 'effects',
            audio: [
                {id: 13, name: 'Ping', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/effects/ping.mp3'},
                {id: 14, name: 'Powerdown', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/effects/powerdown.mp3'},
                {id: 15, name: 'Powerdown2', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/effects/powerdown2.mp3'},
                {id: 16, name: 'Powerup', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/effects/powerup.mp3'},
                {id: 17, name: 'Powerup 2', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/effects/powerup2.mp3'},
                {id: 18, name: 'Powerup 3', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/effects/powerup3.mp3'},
                {id: 19, name: 'Splash', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/effects/splash.mp3'},
                {id: 20, name: 'Splash 2', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/effects/splash2.mp3'},
                {id: 21, name: 'Warp', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/effects/warp.mp3'},
                {id: 22, name: 'Warp 2', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/effects/warp2.mp3'}
            ]
        },
        { 
            name: 'movement',
            audio: [
                {id: 23, name: 'Bounce', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/movement/bounce.mp3'},
                {id: 24, name: 'Bounce 2', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/movement/bounce2.mp3'},
                {id: 25, name: 'Jump', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/movement/jump.mp3'},
                {id: 26, name: 'Smack', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/movement/smack.mp3'}
            ]
        },
        { 
            name: 'speech',
            audio: [
                {id: 27, name: 'Ouch', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/speech/ouch.mp3'},
                {id: 28, name: 'Crazy Laugh', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/speech/crazy_laugh.mp3'},
                {id: 29, name: 'Evil Laugh', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/speech/evil_laugh.mp3'},
                {id: 30, name: 'Girl Laugh', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/speech/girl_laugh.mp3'},
                {id: 31, name: 'Just Laugh', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/speech/laugh.mp3'},
            ]
        },
        { 
            name: 'weapons',
            audio: [
                {id: 32, name: 'Explosion', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/weapons/explosion.mp3'},
                {id: 33, name: 'Explosion 2', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/weapons/explosion2.mp3'},
                {id: 34, name: 'Explosion 3', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/weapons/explosion3.mp3'},
                {id: 35, name: 'Gunshot', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/weapons/gunshot.mp3'},
                {id: 36, name: 'Gunshot 2', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/weapons/gunshot2.mp3'},
                {id: 37, name: 'Laser', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/weapons/laser.mp3'},
                {id: 38, name: 'Laser 2', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/weapons/laser2.mp3'},
                {id: 39, name: 'Laser 3', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/weapons/laser3.mp3'},
                {id: 40, name: 'Laser 4', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/weapons/laser4.mp3'},
            ]
        },
        { 
            name: 'creatures',
            audio: [
                {id: 41, name: 'Bird', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/animals/bird.mp3'},
                {id: 42, name: 'Crow', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/animals/crow.mp3'},
                {id: 43, name: 'Elephant', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/animals/elephant.mp3'},
                {id: 44, name: 'Frog', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/animals/frog.mp3'},
                {id: 45, name: 'Monster Roar', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/animals/monster_roar.mp3'},
                {id: 46, name: 'Pig', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/animals/pig.mp3'},
                {id: 47, name: 'Zombie', url: 'https://s3.eu-central-1.amazonaws.com/arcadeforge/audio_library/animals/zombie.mp3'}
            ]
        },
    ]
}());