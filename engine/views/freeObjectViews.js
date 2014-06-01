GameCreator.FreeObject.prototype.getTabs = function() {
        return  '<a class="tab dialogue-window-tab" data-uifunction="setupCollisionsForm">Collisions</a>' +
                '<a class="tab dialogue-window-tab" data-uifunction="setupOnClickActionsForm">On click</a>' +
                '<a class="tab dialogue-window-tab" data-uifunction="setupCountersForm">Counters</a>';
};

GameCreator.FreeObject.prototype.getStateForm = function(stateId) {
    return 'CONTENT FOR STATE ' + stateId;
};

